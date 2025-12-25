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

// GET /api/admin/vouchers/[id] - Get single voucher
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAdminSession(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - Please login as admin' }, { status: 401 })
    }

    const { id } = await params

    const voucher = await prisma.voucher.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    })

    if (!voucher) {
      return NextResponse.json({ error: 'Voucher not found' }, { status: 404 })
    }

    return NextResponse.json({ voucher })
  } catch (error) {
    console.error('Error fetching voucher:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voucher' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/vouchers/[id] - Update voucher
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAdminSession(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - Please login as admin' }, { status: 401 })
    }

    const { id } = await params
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

    // Check if voucher exists
    const existingVoucher = await prisma.voucher.findUnique({
      where: { id }
    })

    if (!existingVoucher) {
      return NextResponse.json({ error: 'Voucher not found' }, { status: 404 })
    }

    // If code is being changed, check if new code already exists
    if (code && code.toUpperCase() !== existingVoucher.code) {
      const duplicateCode = await prisma.voucher.findUnique({
        where: { code: code.toUpperCase() }
      })

      if (duplicateCode) {
        return NextResponse.json(
          { error: 'Voucher code already exists' },
          { status: 400 }
        )
      }
    }

    // Validate discount value if provided
    if (discountType === 'PERCENTAGE' && discountValue !== undefined) {
      if (discountValue < 0 || discountValue > 100) {
        return NextResponse.json(
          { error: 'Percentage discount must be between 0 and 100' },
          { status: 400 }
        )
      }
    }

    if (discountValue !== undefined && discountValue <= 0) {
      return NextResponse.json(
        { error: 'Discount value must be greater than 0' },
        { status: 400 }
      )
    }

    // Update voucher
    const updateData: any = {}
    if (code !== undefined) updateData.code = code.toUpperCase()
    if (description !== undefined) updateData.description = description
    if (discountType !== undefined) updateData.discountType = discountType
    if (discountValue !== undefined) updateData.discountValue = parseFloat(discountValue)
    if (minOrderValue !== undefined) updateData.minOrderValue = minOrderValue ? parseFloat(minOrderValue) : null
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount ? parseFloat(maxDiscount) : null
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit ? parseInt(usageLimit) : null
    if (validFrom !== undefined) updateData.validFrom = new Date(validFrom)
    if (validUntil !== undefined) updateData.validUntil = new Date(validUntil)
    if (active !== undefined) updateData.active = active

    const voucher = await prisma.voucher.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ voucher })
  } catch (error) {
    console.error('Error updating voucher:', error)
    return NextResponse.json(
      { error: 'Failed to update voucher' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/vouchers/[id] - Delete voucher
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAdminSession(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - Please login as admin' }, { status: 401 })
    }

    const { id } = await params

    // Check if voucher exists
    const voucher = await prisma.voucher.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    })

    if (!voucher) {
      return NextResponse.json({ error: 'Voucher not found' }, { status: 404 })
    }

    // Check if voucher has been used
    if (voucher._count.orders > 0) {
      return NextResponse.json(
        { error: 'Cannot delete voucher that has been used in orders' },
        { status: 400 }
      )
    }

    // Delete voucher
    await prisma.voucher.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Voucher deleted successfully' })
  } catch (error) {
    console.error('Error deleting voucher:', error)
    return NextResponse.json(
      { error: 'Failed to delete voucher' },
      { status: 500 }
    )
  }
}
