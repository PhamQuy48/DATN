import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

// GET /api/auth/forgot-password/dev-info - Get reset link for development
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Get user with reset token
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        email: true,
        resetToken: true,
        resetTokenExpiry: true
      }
    })

    if (!user || !user.resetToken) {
      return NextResponse.json({
        error: 'No reset token found for this email. Please request a password reset first.'
      }, { status: 404 })
    }

    // Check if token is expired
    const isExpired = user.resetTokenExpiry && new Date() > user.resetTokenExpiry

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${user.resetToken}`

    return NextResponse.json({
      email: user.email,
      resetUrl,
      token: user.resetToken,
      expiresAt: user.resetTokenExpiry?.toISOString(),
      isExpired,
      timeLeft: user.resetTokenExpiry
        ? Math.max(0, Math.floor((user.resetTokenExpiry.getTime() - Date.now()) / 1000))
        : 0,
      instructions: [
        '1. Copy the resetUrl and paste it in your browser',
        '2. Or click the link if displayed in a web interface',
        '3. Enter your new password',
        '4. Token expires in 15 minutes from creation'
      ]
    })
  } catch (error) {
    console.error('Error getting dev info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
