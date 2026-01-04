import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    console.log('[Reset Password] 🔑 Reset password request with token')

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token và mật khẩu mới là bắt buộc' },
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

    // Find user by reset token
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
      select: {
        id: true,
        email: true,
        name: true,
        resetToken: true,
        resetTokenExpiry: true,
        banned: true
      }
    })

    if (!user) {
      console.log('[Reset Password] ❌ Invalid token')
      return NextResponse.json(
        { error: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      )
    }

    if (user.banned) {
      console.log('[Reset Password] ❌ User is banned:', user.email)
      return NextResponse.json(
        { error: 'Tài khoản của bạn đã bị khóa' },
        { status: 403 }
      )
    }

    // Check if token is expired
    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      console.log('[Reset Password] ❌ Token expired for:', user.email)
      return NextResponse.json(
        { error: 'Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu link mới.' },
        { status: 400 }
      )
    }

    console.log('[Reset Password] ✅ Valid token for user:', user.email)

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    console.log('[Reset Password] 🔐 Hashed new password')

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    console.log('[Reset Password] ✅ Password updated successfully for:', user.email)

    return NextResponse.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.'
    })

  } catch (error) {
    console.error('[Reset Password] ❌ Error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
