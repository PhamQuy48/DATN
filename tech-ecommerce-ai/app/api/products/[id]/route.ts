import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
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

    // Validate images if provided - must be HTTP/HTTPS URLs only (no local paths allowed)
    if (images !== undefined && images !== null) {
      const imageArray = Array.isArray(images) ? images : [images]
      // Filter out null/empty values first
      const filteredImages = imageArray.filter(img => img && typeof img === 'string' && img.trim() !== '')

      // Only validate if we have images after filtering
      if (filteredImages.length > 0) {
        for (const img of filteredImages) {
          if (!img.startsWith('http://') && !img.startsWith('https://')) {
            console.log('❌ [Update Product] Invalid image URL:', img)
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
      if (images === null) {
        // If images is explicitly null, use placeholder
        updateData.images = 'https://via.placeholder.com/400x300?text=No+Image'
        updateData.thumbnail = 'https://via.placeholder.com/400x300?text=No+Image'
      } else if (Array.isArray(images)) {
        // Filter out null/empty values
        const filteredImages = images.filter(img => img && typeof img === 'string' && img.trim() !== '')
        if (filteredImages.length > 0) {
          updateData.images = filteredImages.join(',')
          updateData.thumbnail = filteredImages[0]
        } else {
          // Empty array - use placeholder
          updateData.images = 'https://via.placeholder.com/400x300?text=No+Image'
          updateData.thumbnail = 'https://via.placeholder.com/400x300?text=No+Image'
        }
      } else {
        // Single image string
        updateData.images = images
        updateData.thumbnail = images
      }
    }
    // Only set thumbnail if it's a valid string (not array)
    if (thumbnail && typeof thumbnail === 'string' && !thumbnail.startsWith('[')) {
      updateData.thumbnail = thumbnail
    }
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
    console.log('🗑️ [Delete Product] Request received')
    const { id } = await params
    console.log('🗑️ [Delete Product] Product ID:', id)

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        productReviews: true,
        promotionEmails: true,
      }
    })

    if (!existingProduct) {
      console.log('❌ [Delete Product] Product not found:', id)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    console.log('📦 [Delete Product] Product found:', existingProduct.name)
    console.log('🔗 [Delete Product] Reviews count:', existingProduct.productReviews.length)
    console.log('🔗 [Delete Product] Promotion emails count:', existingProduct.promotionEmails.length)

    // Note: Reviews and PromotionEmails have onDelete: Cascade,
    // so they will be automatically deleted when product is deleted

    // Delete product (cascade will handle related records)
    console.log('🗑️ [Delete Product] Deleting product (cascade will delete related records)...')
    await prisma.product.delete({
      where: { id },
    })

    console.log('✅ [Delete Product] Product deleted successfully:', existingProduct.name)

    // CRITICAL: Force complete cache purge
    console.log('🔄 [Delete Product] Purging ALL product caches...')

    // Revalidate by tags (if using fetch with tags)
    revalidateTag('products')
    revalidateTag('product-list')
    revalidateTag(`product-${id}`)

    // Revalidate all pages that display products
    revalidatePath('/', 'layout')  // Homepage + all nested pages
    revalidatePath('/products', 'page')  // Products list page only
    revalidatePath('/products', 'layout')  // Products layout + all nested
    revalidatePath(`/products/${existingProduct.slug}`, 'page')  // Product detail
    revalidatePath('/admin/products', 'page')  // Admin products page

    console.log('✅ [Delete Product] All caches purged and pages revalidated')

    return NextResponse.json({
      message: 'Product deleted successfully',
      deletedProduct: {
        id: existingProduct.id,
        name: existingProduct.name,
        slug: existingProduct.slug
      }
    })
  } catch (error) {
    console.error('❌ [Delete Product] Error:', error)

    // Detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ [Delete Product] Error details:', errorMessage)

    return NextResponse.json(
      {
        error: 'Failed to delete product',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}
