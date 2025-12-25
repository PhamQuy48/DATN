import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

// POST /api/vouchers/validate - Validate voucher code and calculate discount
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code, orderTotal } = await request.json()

    if (!code || orderTotal === undefined) {
      return NextResponse.json(
        { error: 'Code and order total are required' },
        { status: 400 }
      )
    }

    // Find voucher by code
    const voucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!voucher) {
      return NextResponse.json(
        { error: 'Invalid voucher code', valid: false },
        { status: 404 }
      )
    }

    // Check if voucher is active
    if (!voucher.active) {
      return NextResponse.json(
        { error: 'This voucher is no longer active', valid: false },
        { status: 400 }
      )
    }

    // Check validity period
    const now = new Date()
    if (now < voucher.validFrom) {
      return NextResponse.json(
        { error: 'This voucher is not yet valid', valid: false },
        { status: 400 }
      )
    }

    if (now > voucher.validUntil) {
      return NextResponse.json(
        { error: 'This voucher has expired', valid: false },
        { status: 400 }
      )
    }

    // Check usage limit
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return NextResponse.json(
        { error: 'This voucher has reached its usage limit', valid: false },
        { status: 400 }
      )
    }

    // Check minimum order value
    if (voucher.minOrderValue && orderTotal < voucher.minOrderValue) {
      return NextResponse.json(
        {
          error: `Minimum order value of ${voucher.minOrderValue.toLocaleString('vi-VN')}đ required`,
          valid: false
        },
        { status: 400 }
      )
    }

    // Calculate discount
    let discount = 0

    if (voucher.discountType === 'PERCENTAGE') {
      discount = (orderTotal * voucher.discountValue) / 100

      // Apply max discount if specified
      if (voucher.maxDiscount && discount > voucher.maxDiscount) {
        discount = voucher.maxDiscount
      }
    } else if (voucher.discountType === 'FIXED_AMOUNT') {
      discount = voucher.discountValue

      // Discount cannot exceed order total
      if (discount > orderTotal) {
        discount = orderTotal
      }
    }

    // Round to 2 decimal places
    discount = Math.round(discount * 100) / 100

    return NextResponse.json({
      valid: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue
      },
      discount,
      finalTotal: orderTotal - discount
    })
  } catch (error) {
    console.error('Error validating voucher:', error)
    return NextResponse.json(
      { error: 'Failed to validate voucher', valid: false },
      { status: 500 }
    )
  }
}
