import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Public API để lấy site settings (không cần auth)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (key) {
      // Lấy một setting cụ thể
      const setting = await prisma.siteSettings.findUnique({
        where: { key }
      })

      if (!setting) {
        // Return default value nếu không tìm thấy
        return NextResponse.json({ key, value: '' })
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
