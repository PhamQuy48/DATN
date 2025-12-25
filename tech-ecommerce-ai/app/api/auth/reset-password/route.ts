import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Mã xác nhận và mật khẩu mới là bắt buộc' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }

    // Find reset token
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Mã xác nhận không hợp lệ' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json(
        { error: 'Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.' },
        { status: 400 }
      )
    }

    // Check if token has been used
    if (resetToken.used) {
      return NextResponse.json(
        { error: 'Mã xác nhận đã được sử dụng' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Người dùng không tồn tại' },
        { status: 404 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user password and mark token as used in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword }
      }),
      prisma.passwordReset.update({
        where: { token },
        data: { used: true }
      })
    ])

    // Delete all other unused tokens for this email
    await prisma.passwordReset.deleteMany({
      where: {
        email: resetToken.email,
        used: false
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.'
    })

  } catch (error) {
    console.error('Error in reset password:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
