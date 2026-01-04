import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email/nodemailer'
import { generateVerificationEmail } from '@/lib/email/templates/verification'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Create user with verification token
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
        verificationToken,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    console.log('[Register] ✅ User created:', email)

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`

    const emailHtml = generateVerificationEmail({
      name,
      verificationUrl,
      verificationCode,
    })

    try {
      const result = await sendEmail({
        to: email,
        subject: '✉️ Xác thực email - ShopQM',
        html: emailHtml,
      })

      if (result.success) {
        console.log('[Register] ✅ Verification email sent to:', email)
      } else {
        console.error('[Register] ❌ Failed to send verification email:', result.error)
      }
    } catch (emailError) {
      console.error('[Register] ❌ Error sending verification email:', emailError)
      // Don't fail registration if email fails - user can resend later
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          ...user,
          role: user.role.toLowerCase(), // Convert CUSTOMER to user for mobile app
        },
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
        emailSent: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Đăng ký thất bại' },
      { status: 500 }
    )
  }
}
