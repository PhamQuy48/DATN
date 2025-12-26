import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('📥 [Create Product] Request received')
    const body = await request.json()
    console.log('📦 [Create Product] Body:', body)

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
      console.log('❌ [Create Product] Missing required fields')
      return NextResponse.json(
        {
          error: 'Thiếu thông tin bắt buộc',
          details: 'Cần có: tên sản phẩm, thương hiệu, giá, danh mục'
        },
        { status: 400 }
      )
    }

    // Validate images - must be HTTP/HTTPS URLs only (no local paths allowed)
    // Filter out null/empty values first
    let validImages = null
    if (images) {
      const imageArray = Array.isArray(images) ? images : [images]
      // Filter out null, undefined, empty strings
      const filteredImages = imageArray.filter(img => img && typeof img === 'string' && img.trim() !== '')

      // Only validate if we have images after filtering
      if (filteredImages.length > 0) {
        // Validate each image URL
        for (const img of filteredImages) {
          if (!img.startsWith('http://') && !img.startsWith('https://')) {
            console.log('❌ [Create Product] Invalid image URL:', img)
            return NextResponse.json(
              {
                error: 'URL hình ảnh không hợp lệ',
                details: 'Chỉ chấp nhận URL HTTP/HTTPS. Vui lòng upload ảnh qua upload API trước.',
                invalidUrl: img
              },
              { status: 400 }
            )
          }
        }
        validImages = filteredImages
      }
    }

    // If no valid images, use a default placeholder
    const imageData = validImages && validImages.length > 0
      ? validImages.join(',')
      : 'https://via.placeholder.com/400x300?text=No+Image'

    const thumbnailData = validImages && validImages.length > 0
      ? validImages[0]
      : 'https://via.placeholder.com/400x300?text=No+Image'

    console.log('📸 [Create Product] Images:', { original: images, valid: validImages, final: imageData })

    console.log('💾 [Create Product] Creating in database...')

    // Create product in database
    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        brand,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        description: description || '',
        categoryId,
        stock: parseInt(stock) || 0,
        rating: parseFloat(rating) || 5,
        reviews: parseInt(reviews) || 0,
        sold: 0,
        views: 0,
        images: imageData,
        thumbnail: thumbnailData,
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

    console.log('✅ [Create Product] Success:', product.id, product.name)

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('❌ [Create Product] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Không thể tạo sản phẩm',
        details: errorMessage
      },
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
