import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import nodemailer from 'nodemailer'
import { notifyUser } from '@/lib/notifications/sse'

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

// Email template for voucher
const generateVoucherEmail = (userName: string, voucher: any) => {
  const discountText = voucher.discountType === 'PERCENTAGE'
    ? `${voucher.discountValue}%`
    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.discountValue)

  const minOrderText = voucher.minOrderValue
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.minOrderValue)
    : 'Không giới hạn'

  const validUntil = new Date(voucher.validUntil).toLocaleDateString('vi-VN')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã giảm giá đặc biệt từ Thế Giới Công Nghệ</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🎉 MÃ GIẢM GIÁ ĐẶC BIỆT
              </h1>
              <p style="margin: 10px 0 0; color: #d1fae5; font-size: 14px;">
                Dành riêng cho bạn từ Thế Giới Công Nghệ
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Xin chào <strong>${userName}</strong>,
              </p>

              <p style="margin: 0 0 30px; color: #6b7280; font-size: 15px; line-height: 1.6;">
                Chúng tôi rất vui được gửi đến bạn mã giảm giá đặc biệt! Hãy sử dụng mã này để nhận ưu đãi hấp dẫn cho đơn hàng tiếp theo của bạn.
              </p>

              <!-- Voucher Code Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px dashed #10b981; border-radius: 12px; padding: 30px; text-align: center;">
                    <p style="margin: 0 0 10px; color: #047857; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                      MÃ GIẢM GIÁ
                    </p>
                    <p style="margin: 0 0 5px; color: #065f46; font-size: 36px; font-weight: bold; letter-spacing: 2px; font-family: 'Courier New', monospace;">
                      ${voucher.code}
                    </p>
                    <p style="margin: 0; color: #10b981; font-size: 18px; font-weight: bold;">
                      Giảm ${discountText}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Voucher Details -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 0 0 30px;">
                <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: 600;">
                  📋 Chi tiết ưu đãi:
                </h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                      💰 Giá trị giảm:
                    </td>
                    <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">
                      ${discountText}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">
                      📦 Đơn hàng tối thiểu:
                    </td>
                    <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #e5e7eb;">
                      ${minOrderText}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">
                      ⏰ Có hiệu lực đến:
                    </td>
                    <td style="padding: 8px 0; color: #dc2626; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #e5e7eb;">
                      ${validUntil}
                    </td>
                  </tr>
                  ${voucher.maxDiscount ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">
                      🎯 Giảm tối đa:
                    </td>
                    <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #e5e7eb;">
                      ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.maxDiscount)}
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3004'}/products" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                      🛒 Mua sắm ngay
                    </a>
                  </td>
                </tr>
              </table>

              ${voucher.description ? `
              <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 15px; margin: 0 0 20px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                  <strong>📝 Ghi chú:</strong> ${voucher.description}
                </p>
              </div>
              ` : ''}

              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Chúc bạn có những trải nghiệm mua sắm tuyệt vời! 🎁
              </p>
              <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 600;">
                Trân trọng,<br>
                Đội ngũ Thế Giới Công Nghệ
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Thế Giới Công Nghệ. Tất cả quyền được bảo lưu.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Email này được gửi tự động, vui lòng không trả lời.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// POST /api/admin/vouchers/send-email - Send voucher to selected users
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

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    let successCount = 0
    let failCount = 0

    // Send emails and create notifications
    for (const user of users) {
      try {
        // Send email
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: user.email,
          subject: `🎉 Mã giảm giá ${voucher.code} dành riêng cho bạn - Thế Giới Công Nghệ`,
          html: generateVoucherEmail(user.name, voucher),
        })

        // Create notification for user
        const notification = await prisma.notification.create({
          data: {
            userId: user.id,
            title: '🎁 Bạn nhận được mã giảm giá mới!',
            message: `Bạn vừa nhận được mã giảm giá ${voucher.code}${voucher.discountType === 'PERCENTAGE' ? ` giảm ${voucher.discountValue}%` : ` giảm ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.discountValue)}`}. Hãy sử dụng ngay để nhận ưu đãi!\n\nThời hạn: ${new Date(voucher.validUntil).toLocaleDateString('vi-VN')}${voucher.minOrderValue ? `\nĐơn tối thiểu: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.minOrderValue)}` : ''}`,
            type: 'VOUCHER',
            read: false
          }
        })

        // Send real-time notification via SSE
        notifyUser(user.id, {
          ...notification,
          createdAt: notification.createdAt.toISOString()
        })

        console.log(`✅ Voucher notification sent to user: ${user.email} (${user.id})`)

        successCount++
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error)
        failCount++
      }
    }

    return NextResponse.json({
      success: true,
      successCount,
      failCount,
      message: `Đã gửi email cho ${successCount} khách hàng${failCount > 0 ? `, thất bại ${failCount}` : ''}`
    })
  } catch (error) {
    console.error('Error sending voucher emails:', error)
    return NextResponse.json(
      { error: 'Failed to send voucher emails' },
      { status: 500 }
    )
  }
}
