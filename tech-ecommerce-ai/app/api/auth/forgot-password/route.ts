import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    console.log('[Forgot Password] 📧 Request for email:', email)

    if (!email) {
      return NextResponse.json(
        { error: 'Email là bắt buộc' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        banned: true
      }
    })

    // Always return success to prevent email enumeration attacks
    // But only send email if user actually exists
    if (!user) {
      console.log('[Forgot Password] ⚠️ User not found for email:', email)
      // Return success anyway to prevent enumeration
      return NextResponse.json({
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Link có hiệu lực trong 15 phút.'
      })
    }

    if (user.banned) {
      console.log('[Forgot Password] ❌ User is banned:', email)
      return NextResponse.json({
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Link có hiệu lực trong 15 phút.'
      })
    }

    // Generate 6-digit reset code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString()
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    console.log('[Forgot Password] 🔑 Generated reset token for:', email)

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    console.log('[Forgot Password] 💾 Saved reset token to database')

    // Development mode: Skip email sending if not configured
    const isEmailConfigured = process.env.EMAIL_USER &&
                               process.env.EMAIL_PASSWORD &&
                               !process.env.EMAIL_USER.includes('your-') &&
                               !process.env.EMAIL_PASSWORD.includes('your-')

    if (!isEmailConfigured) {
      // Development mode - Log reset link instead of sending email
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
      console.log('\n🔗 ============================================')
      console.log('📧 [DEV MODE] Reset Password Link:')
      console.log(`👤 User: ${user.email}`)
      console.log(`🔗 Link: ${resetUrl}`)
      console.log(`⏰ Expires: 15 minutes`)
      console.log('============================================\n')
      console.log('[Forgot Password] ⚠️ Email not configured - Using DEV mode')
    } else {
      // Production mode - Send actual email
      const resetResult = await sendPasswordResetEmail(user.email, resetToken)

      if (!resetResult.success) {
        console.error('[Forgot Password] ❌ Failed to send email:', resetResult.error)
        // Still return success to user to prevent information disclosure
      } else {
        console.log('[Forgot Password] ✅ Reset email sent successfully to:', email)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư. Link có hiệu lực trong 15 phút.'
    })
  } catch (error) {
    console.error('[Forgot Password] ❌ Error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
