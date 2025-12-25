import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/db/prisma'

const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
)

// GET /api/staff/me - Get current staff user
export async function GET(request: NextRequest) {
  try {
    const staffSessionCookie = request.cookies.get('staff_session')

    if (!staffSessionCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const { payload } = await jwtVerify(staffSessionCookie.value, SECRET_KEY)

    // Get fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        banned: true,
      },
    })

    if (!user || user.banned) {
      return NextResponse.json(
        { error: 'User not found or banned' },
        { status: 401 }
      )
    }

    if (user.role !== 'STAFF' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Staff me error:', error)
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    )
  }
}
