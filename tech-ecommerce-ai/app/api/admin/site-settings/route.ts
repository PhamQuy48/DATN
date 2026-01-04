import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// GET - Lấy tất cả settings hoặc một setting cụ thể
export async function GET(request: NextRequest) {
  try {
    // Check admin auth
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin-token')
    if (!adminToken || adminToken.value !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (key) {
      // Lấy một setting cụ thể
      const setting = await prisma.siteSettings.findUnique({
        where: { key }
      })

      if (!setting) {
        return NextResponse.json({ error: 'Setting not found' }, { status: 404 })
      }

      return NextResponse.json(setting)
    }

    // Lấy tất cả settings
    const settings = await prisma.siteSettings.findMany({
      orderBy: { key: 'asc' }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    )
  }
}

// POST/PUT - Tạo hoặc cập nhật một setting
export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin-token')
    if (!adminToken || adminToken.value !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { key, value } = body

    if (!key || !value) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }

    // Upsert (create or update)
    const setting = await prisma.siteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Error updating site setting:', error)
    return NextResponse.json(
      { error: 'Failed to update site setting' },
      { status: 500 }
    )
  }
}

// DELETE - Xóa một setting
export async function DELETE(request: NextRequest) {
  try {
    // Check admin auth
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin-token')
    if (!adminToken || adminToken.value !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      )
    }

    await prisma.siteSettings.delete({
      where: { key }
    })

    return NextResponse.json({ message: 'Setting deleted successfully' })
  } catch (error) {
    console.error('Error deleting site setting:', error)
    return NextResponse.json(
      { error: 'Failed to delete site setting' },
      { status: 500 }
    )
  }
}
