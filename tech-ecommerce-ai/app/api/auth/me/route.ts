import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/check-auth'

// GET /api/auth/me - Get current user info
export async function GET(request: NextRequest) {
  try {
    const user = await checkAuth(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
    console.error('Error getting user info:', error)
    return NextResponse.json(
      { error: 'Failed to get user info' },
      { status: 500 }
    )
  }
}
