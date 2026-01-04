import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// GET - Lấy tất cả banners (cho admin) hoặc chỉ active banners (cho public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicView = searchParams.get('public') === 'true'

    if (publicView) {
      // Public view - chỉ lấy banners đang active, sắp xếp theo order
      const banners = await prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      })
      return NextResponse.json(banners)
    }

    // Admin view - check auth
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin-token')
    if (!adminToken || adminToken.value !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Lấy tất cả banners cho admin
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(banners)
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}

// POST - Tạo banner mới
export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin-token')
    if (!adminToken || adminToken.value !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, subtitle, cta, link, imageUrl, gradient, emoji, order, isActive } = body

    if (!title || !subtitle || !cta || !link) {
      return NextResponse.json(
        { error: 'Title, subtitle, cta, and link are required' },
        { status: 400 }
      )
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        cta,
        link,
        imageUrl: imageUrl || '',
        gradient: gradient || null,
        emoji: emoji || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    )
  }
}
