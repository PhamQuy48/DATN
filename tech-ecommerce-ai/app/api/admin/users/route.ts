import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// Helper function to verify admin session
async function verifyAdminSession(request: NextRequest) {
  // Check admin cookie first
  const adminSessionCookie = request.cookies.get('admin_session')
  if (adminSessionCookie) {
    const userId = adminSessionCookie.value
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    if (user && user.role === 'ADMIN' && !user.banned) {
      return user
    }
  }

  return null
}

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession(request)

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
