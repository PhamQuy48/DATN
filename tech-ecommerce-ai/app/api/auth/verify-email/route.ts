import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    console.log('[Verify Email] 🔍 Token:', token)

    if (!token) {
      return NextResponse.json(
        { error: 'Token xác thực là bắt buộc' },
        { status: 400 }
      )
    }

    // Find user by verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        verificationToken: true,
      }
    })

    if (!user) {
      console.log('[Verify Email] ❌ Invalid token')
      return NextResponse.json(
        { error: 'Token xác thực không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      console.log('[Verify Email] ℹ️ Email already verified for:', user.email)
      return NextResponse.json({
        success: true,
        message: 'Email đã được xác thực trước đó',
        alreadyVerified: true,
      })
    }

    // Update user - mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null, // Clear token after use
      }
    })

    console.log('[Verify Email] ✅ Email verified successfully for:', user.email)

    return NextResponse.json({
      success: true,
      message: 'Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.',
      user: {
        email: user.email,
        name: user.name,
      }
    })
  } catch (error) {
    console.error('[Verify Email] ❌ Error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xác thực email' },
      { status: 500 }
    )
  }
}
