import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { sendEmail } from '@/lib/email/nodemailer'
import { generateVerificationEmail } from '@/lib/email/templates/verification'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    console.log('[Resend Verification] 📧 Request for email:', email)

    if (!email) {
      return NextResponse.json(
        { error: 'Email là bắt buộc' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        banned: true,
      }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      console.log('[Resend Verification] ⚠️ User not found:', email)
      return NextResponse.json({
        success: true,
        message: 'Nếu email tồn tại, chúng tôi đã gửi lại email xác thực.'
      })
    }

    if (user.banned) {
      console.log('[Resend Verification] ❌ User banned:', email)
      return NextResponse.json(
        { error: 'Tài khoản đã bị khóa' },
        { status: 403 }
      )
    }

    if (user.emailVerified) {
      console.log('[Resend Verification] ℹ️ Email already verified:', email)
      return NextResponse.json({
        success: true,
        message: 'Email đã được xác thực trước đó',
        alreadyVerified: true,
      })
    }

    // Generate new verification token (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationToken = crypto.randomBytes(32).toString('hex')

    console.log('[Resend Verification] 🔑 Generated new token')

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
      }
    })

    // Generate verification URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`

    // Send verification email
    const emailHtml = generateVerificationEmail({
      name: user.name,
      verificationUrl,
      verificationCode,
    })

    const result = await sendEmail({
      to: user.email,
      subject: '✉️ Xác thực email - ShopQM',
      html: emailHtml,
    })

    if (!result.success) {
      console.error('[Resend Verification] ❌ Failed to send email:', result.error)
      return NextResponse.json(
        { error: 'Không thể gửi email xác thực. Vui lòng thử lại sau.' },
        { status: 500 }
      )
    }

    console.log('[Resend Verification] ✅ Email sent successfully to:', email)

    return NextResponse.json({
      success: true,
      message: 'Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.'
    })
  } catch (error) {
    console.error('[Resend Verification] ❌ Error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
