import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// GET /api/admin/profile - Get current admin profile
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('admin_session')

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: 'Không tìm thấy session' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionCookie.value },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        createdAt: true,
      },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      user: {
        ...user,
        avatar: user.image
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/profile - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('admin_session')

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: 'Không tìm thấy session' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, avatar } = body

    // Verify user is admin
    const user = await prisma.user.findUnique({
      where: { id: sessionCookie.value },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email đã được sử dụng' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {}
    if (name) updateData.name = name
    if (email && email !== user.email) updateData.email = email
    if (avatar !== undefined) updateData.image = avatar

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: sessionCookie.value },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        avatar: updatedUser.image
      },
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra khi cập nhật profile' },
      { status: 500 }
    )
  }
}
