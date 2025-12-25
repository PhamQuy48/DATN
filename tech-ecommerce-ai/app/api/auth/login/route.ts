import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc!' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        image: true,
        banned: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng!' },
        { status: 401 }
      )
    }

    // Check if user is banned
    if (user.banned) {
      return NextResponse.json(
        { error: 'Tài khoản đã bị khóa!' },
        { status: 403 }
      )
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng!' },
        { status: 401 }
      )
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: {
        ...userWithoutPassword,
        role: user.role.toLowerCase(), // Convert ADMIN to admin, CUSTOMER to user
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Lỗi server!' },
      { status: 500 }
    )
  }
}
