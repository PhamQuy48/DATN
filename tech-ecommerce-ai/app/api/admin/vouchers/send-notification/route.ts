import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// Helper function to verify admin session
async function verifyAdminSession(request: NextRequest) {
  // Check admin cookie first
  const adminSessionCookie = request.cookies.get('admin_session')
  if (adminSessionCookie) {
    const userId = adminSessionCookie.value
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    if (user && user.role === 'ADMIN' && !user.banned) {
      return user
    }
  }

  return null
}

// POST /api/admin/vouchers/send-notification - Send voucher notification to selected users
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminSession(request)

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { voucherId, userIds } = await request.json()

    if (!voucherId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing voucherId or userIds' },
        { status: 400 }
      )
    }

    // Get voucher
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId }
    })

    if (!voucher) {
      return NextResponse.json({ error: 'Voucher not found' }, { status: 404 })
    }

    // Get users
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
        role: 'CUSTOMER',
        banned: false
      }
    })

    if (users.length === 0) {
      return NextResponse.json({ error: 'No valid users found' }, { status: 400 })
    }

    let successCount = 0

    // Create notifications for each user
    for (const user of users) {
      try {
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: '🎁 Bạn nhận được mã giảm giá mới!',
            message: `Chúc mừng ${user.name}! Bạn vừa nhận được mã giảm giá đặc biệt:\n\n📌 MÃ: ${voucher.code}\n💰 Giảm: ${voucher.discountType === 'PERCENTAGE' ? `${voucher.discountValue}%` : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.discountValue)}${voucher.minOrderValue ? `\n📦 Đơn tối thiểu: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.minOrderValue)}` : ''}${voucher.maxDiscount ? `\n🎯 Giảm tối đa: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.maxDiscount)}` : ''}\n⏰ Hiệu lực đến: ${new Date(voucher.validUntil).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}\n\nHãy sử dụng ngay để nhận ưu đãi hấp dẫn! 🛍️`,
            type: 'VOUCHER',
            read: false
          }
        })
        successCount++
      } catch (error) {
        console.error(`Failed to create notification for user ${user.email}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      successCount,
      message: `Đã gửi thông báo cho ${successCount} khách hàng`
    })
  } catch (error) {
    console.error('Error sending voucher notifications:', error)
    return NextResponse.json(
      { error: 'Failed to send voucher notifications' },
      { status: 500 }
    )
  }
}
