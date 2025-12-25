import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// GET /api/products/[id] - Get product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const productRaw = await prisma.product.findUnique({
      where: { id },
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

    // Wrap product in object for consistency with /products response
    return NextResponse.json({ product, relatedProducts })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      name,
      slug,
      description,
      price,
      salePrice,
      brand,
      categoryId,
      specs,
      images,
      thumbnail,
      stock,
      sku,
      featured,
      sold,
      views,
      rating,
      reviews,
    } = body

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Product with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Check if SKU is being changed and if it already exists
    if (sku && sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku },
      })

      if (skuExists) {
        return NextResponse.json(
          { error: 'Product with this SKU already exists' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {}
    if (name) updateData.name = name
    if (slug) updateData.slug = slug
    if (description) updateData.description = description
    if (price !== undefined) updateData.price = parseFloat(price)
    if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(salePrice) : null
    if (brand) updateData.brand = brand
    if (categoryId) updateData.categoryId = categoryId
    if (specs !== undefined) updateData.specs = specs
    if (images !== undefined) {
      updateData.images = Array.isArray(images) ? images.join(',') : images
      // Update thumbnail to first image
      if (Array.isArray(images) && images.length > 0) {
        updateData.thumbnail = images[0]
      }
    }
    if (thumbnail) updateData.thumbnail = thumbnail
    if (stock !== undefined) updateData.stock = parseInt(stock)
    if (sku) updateData.sku = sku
    if (typeof featured === 'boolean') updateData.featured = featured
    if (sold !== undefined) updateData.sold = parseInt(sold)
    if (views !== undefined) updateData.views = parseInt(views)
    if (rating !== undefined) updateData.rating = parseFloat(rating)
    if (reviews !== undefined) updateData.reviews = parseInt(reviews)

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
