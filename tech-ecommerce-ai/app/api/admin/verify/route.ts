import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('admin_session')

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: 'Không tìm thấy session' },
        { status: 401 }
      )
    }

    // Verify user exists and is admin
    const user = await prisma.user.findUnique({
      where: { id: sessionCookie.value },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        banned: true,
        image: true,
      },
    })

    if (!user || user.role !== 'ADMIN' || user.banned) {
      return NextResponse.json(
        { error: 'Session không hợp lệ' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.image,
      },
    })
  } catch (error) {
    console.error('Verify session error:', error)
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}
