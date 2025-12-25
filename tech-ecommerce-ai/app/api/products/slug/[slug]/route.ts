import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// GET /api/products/slug/[slug] - Get product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const productRaw = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    if (!productRaw) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Convert images from comma-separated string to array
    const product = {
      ...productRaw,
      images: productRaw.images
        ? (productRaw.images as string).split(',').map(img => img.trim())
        : []
    }

    // Get related products from same category
    const relatedProductsRaw = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id }
      },
      take: 4,
      orderBy: { createdAt: 'desc' }
    })

    const relatedProducts = relatedProductsRaw.map(p => ({
      ...p,
      images: p.images
        ? (p.images as string).split(',').map(img => img.trim())
        : []
    }))

    return NextResponse.json({ product, relatedProducts })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
