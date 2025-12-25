import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { checkAuth } from '@/lib/auth/check-auth'
import { sendEmail } from '@/lib/email/nodemailer'
import { generatePromotionEmail } from '@/lib/email/templates/promotion'

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await checkAuth(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, discountPercent, validUntil } = body

    // Validate input
    if (!productId || !discountPercent) {
      return NextResponse.json(
        { error: 'Product ID and discount percent are required' },
        { status: 400 }
      )
    }

    if (discountPercent < 1 || discountPercent > 100) {
      return NextResponse.json(
        { error: 'Discount percent must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Get product with category
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: {
          select: { name: true },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get all users with emails
    const allUsers = await prisma.user.findMany({
      where: {
        banned: false,
      },
      select: {
        email: true,
        name: true,
      },
    })

    // Filter out users without email
    const users = allUsers.filter(user => user.email !== null && user.email !== '')

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'No users found to send emails to' },
        { status: 400 }
      )
    }

    // Send emails
    let successCount = 0
    let failCount = 0
    const promises = users.map(async (customer) => {
      try {
        const emailHtml = generatePromotionEmail({
          customerName: customer.name,
          product,
          discountPercent,
          validUntil: validUntil
            ? new Date(validUntil).toLocaleDateString('vi-VN')
            : undefined,
        })

        const result = await sendEmail({
          to: customer.email,
          subject: `🎉 Giảm ${discountPercent}% cho ${product.name}`,
          html: emailHtml,
        })

        if (result.success) {
          successCount++
        } else {
          failCount++
        }
      } catch (error) {
        console.error(`Error sending email to ${customer.email}:`, error)
        failCount++
      }
    })

    // Wait for all emails to be sent
    await Promise.all(promises)

    // Save promotion email history
    const promotionEmail = await prisma.promotionEmail.create({
      data: {
        productId,
        discountPercent,
        validUntil: validUntil ? new Date(validUntil) : null,
        sentTo: users.length,
        successCount,
        failCount,
        sentBy: user.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Sent ${successCount} emails successfully, ${failCount} failed`,
      data: {
        id: promotionEmail.id,
        sentTo: users.length,
        successCount,
        failCount,
      },
    })
  } catch (error) {
    console.error('Error sending promotion emails:', error)
    return NextResponse.json(
      { error: 'Failed to send promotion emails' },
      { status: 500 }
    )
  }
}

// GET - Get promotion email history
export async function GET(request: NextRequest) {
  try {
    const user = await checkAuth(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const promotionEmails = await prisma.promotionEmail.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            thumbnail: true,
            price: true,
            salePrice: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
      take: 50, // Limit to last 50 promotions
    })

    return NextResponse.json({ promotionEmails })
  } catch (error) {
    console.error('Error fetching promotion emails:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotion emails' },
      { status: 500 }
    )
  }
}
