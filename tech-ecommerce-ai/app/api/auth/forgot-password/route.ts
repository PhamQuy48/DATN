import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { sendPasswordResetEmail, generateResetCode } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email là bắt buộc' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success to prevent email enumeration attacks
    // But only send email if user exists
    if (user) {
      // Delete any existing unused reset tokens for this email
      await prisma.passwordReset.deleteMany({
        where: {
          email,
          used: false
        }
      })

      // Generate reset code
      const resetCode = generateResetCode()

      // Create reset token (expires in 15 minutes)
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + 15)

      await prisma.passwordReset.create({
        data: {
          email,
          token: resetCode,
          expiresAt,
          used: false
        }
      })

      // Send email
      const emailResult = await sendPasswordResetEmail(email, resetCode)

      if (!emailResult.success) {
        console.error('Failed to send reset email:', emailResult.error)
        // Still return success to prevent exposing email configuration issues
      }
    }

    // Always return success message
    return NextResponse.json({
      success: true,
      message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được mã đặt lại mật khẩu trong vài phút.'
    })

  } catch (error) {
    console.error('Error in forgot password:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
