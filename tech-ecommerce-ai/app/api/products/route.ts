import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      slug,
      brand,
      price,
      salePrice,
      description,
      categoryId,
      stock,
      rating,
      reviews,
      images,
    } = body

    // Validate required fields
    if (!name || !brand || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create product in database
    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        brand,
        price,
        salePrice,
        description: description || '',
        categoryId,
        stock: stock || 0,
        rating: rating || 5,
        reviews: reviews || 0,
        sold: 0,
        views: 0,
        images: Array.isArray(images) ? images.join(',') : images,
        thumbnail: Array.isArray(images) ? images[0] : images,
        sku: `PROD-${Date.now()}`,
        specs: '{}',
        featured: false,
      },
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

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Lấy query parameters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const brand = searchParams.get('brand')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build where clause for Prisma
    const where: any = {}

    // Filter by category
    if (category) {
      const categoryData = await prisma.category.findUnique({
        where: { slug: category }
      })
      if (categoryData) {
        where.categoryId = categoryData.id
      }
    }

    // Filter by search
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
      ]
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Filter by brand
    if (brand) {
      where.brand = brand
    }

    // Filter by featured
    if (featured === 'true') {
      where.featured = true
    }

    // Build orderBy for sorting
    let orderBy: any = { createdAt: 'desc' }
    switch (sortBy) {
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      case 'popular':
        orderBy = { sold: 'desc' }
        break
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Get total count
    const totalProducts = await prisma.product.count({ where })
    const totalPages = Math.ceil(totalProducts / limit)

    // Get paginated products from database
    const productsRaw = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
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

    // Convert images from comma-separated string to array
    const products = productsRaw.map(product => ({
      ...product,
      images: product.images
        ? (product.images as string).split(',').map(img => img.trim())
        : []
    }))

    // Get unique brands for filter
    const allProducts = await prisma.product.findMany({
      select: { brand: true },
    })
    const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))].sort()

    // Get all categories for filter
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        brands,
        categories,
      },
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)

    // More helpful error message
    const errorMessage = error.message || 'Failed to fetch products'
    const isDatabaseError = error.code === 'P1001' || error.code === 'P2002' || errorMessage.includes('database')

    if (isDatabaseError) {
      console.error('⚠️  DATABASE ERROR: Make sure MySQL/XAMPP is running!')
      return NextResponse.json(
        {
          error: 'Database connection failed. Please start your database server (MySQL/XAMPP).',
          details: errorMessage
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
