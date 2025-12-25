import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

// Helper function to verify admin session
async function verifyAdminSession(request: NextRequest) {
  // Check admin cookie first
  const adminSessionCookie = request.cookies.get('admin_session')
  if (adminSessionCookie) {
    const userId = adminSessionCookie.value
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    if (user && user.role === 'ADMIN' && !user.banned) {
      return user
    }
  }

  // Fallback to NextAuth session
  const session = await getServerSession(authOptions)
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    if (user && user.role === 'ADMIN' && !user.banned) {
      return user
    }
  }

  return null
}

// GET /api/admin/vouchers - Get all vouchers
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdminSession(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - Please login as admin' }, { status: 401 })
    }

    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    })

    return NextResponse.json({ vouchers })
  } catch (error) {
    console.error('Error fetching vouchers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vouchers' },
      { status: 500 }
    )
  }
}

// POST /api/admin/vouchers - Create new voucher
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdminSession(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - Please login as admin' }, { status: 401 })
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil,
      active
    } = await request.json()

    // Validation
    if (!code || !discountType || !discountValue || !validFrom || !validUntil) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existingVoucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (existingVoucher) {
      return NextResponse.json(
        { error: 'Voucher code already exists' },
        { status: 400 }
      )
    }

    // Validate discount value
    if (discountType === 'PERCENTAGE' && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 0 and 100' },
        { status: 400 }
      )
    }

    if (discountValue <= 0) {
      return NextResponse.json(
        { error: 'Discount value must be greater than 0' },
        { status: 400 }
      )
    }

    // Create voucher
    const voucher = await prisma.voucher.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        active: active !== undefined ? active : true
      }
    })

    return NextResponse.json({ voucher }, { status: 201 })
  } catch (error) {
    console.error('Error creating voucher:', error)
    return NextResponse.json(
      { error: 'Failed to create voucher' },
      { status: 500 }
    )
  }
}
