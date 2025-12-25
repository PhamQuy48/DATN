import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// GET /api/reviews/[productId] - Get all reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'recent' // recent, helpful, rating

    const skip = (page - 1) * limit

    // Determine sort order
    let orderBy: any = { createdAt: 'desc' }
    if (sortBy === 'helpful') {
      orderBy = { helpful: 'desc' }
    } else if (sortBy === 'rating') {
      orderBy = { rating: 'desc' }
    }

    // Get reviews
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.review.count({
        where: { productId }
      })
    ])

    // Get rating summary
    const ratingSummary = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId },
      _count: { rating: true }
    })

    const summary = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }

    ratingSummary.forEach(item => {
      summary[item.rating as keyof typeof summary] = item._count.rating
    })

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    return NextResponse.json({
      reviews: reviews.map(review => ({
        ...review,
        images: review.images ? JSON.parse(review.images) : []
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      summary: {
        avgRating,
        totalReviews: totalCount,
        ratingDistribution: summary
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
