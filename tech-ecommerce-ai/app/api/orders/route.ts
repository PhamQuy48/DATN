import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { checkAuth } from '@/lib/auth/check-auth'

// GET /api/orders - Get all orders (admin) or user's orders
export async function GET(request: NextRequest) {
  try {
    const user = await checkAuth(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const where: any = {}

    // If not admin or staff, only show user's own orders
    if (user.role !== 'ADMIN' && user.role !== 'STAFF') {
      where.userId = user.id
    }

    // Filter by status if provided
    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const user = await checkAuth(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Received order data:', JSON.stringify(body, null, 2))

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      totalAmount,
      shippingFee,
      paymentMethod,
      voucherId,
      voucherCode,
      discount,
      notes,
    } = body

    // Validate required fields
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !shippingAddress ||
      !items ||
      items.length === 0 ||
      !totalAmount ||
      !paymentMethod
    ) {
      console.error('Validation failed:', {
        hasCustomerName: !!customerName,
        hasCustomerEmail: !!customerEmail,
        hasCustomerPhone: !!customerPhone,
        hasShippingAddress: !!shippingAddress,
        hasItems: !!items,
        itemsLength: items?.length,
        hasTotalAmount: !!totalAmount,
        hasPaymentMethod: !!paymentMethod
      })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate stock availability for all products
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, name: true }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productName} not found` },
          { status: 404 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Sản phẩm "${product.name}" không đủ hàng. Còn lại: ${product.stock}` },
          { status: 400 }
        )
      }
    }

    // Generate order number
    const orderNumber = `DH${Date.now().toString().slice(-8)}`

    // Determine payment status based on payment method
    // COD = PENDING (pay on delivery), others = PAID (prepaid)
    const paymentStatus = paymentMethod === 'cod' ? 'PENDING' : 'PAID'

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        totalAmount,
        discount: discount || 0,
        shippingFee: shippingFee || 0,
        voucherId: voucherId || null,
        voucherCode: voucherCode || null,
        paymentMethod,
        paymentStatus,
        status: 'PENDING',
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Decrease stock for all ordered products
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    // If voucher was used, increment usedCount
    if (voucherId) {
      await prisma.voucher.update({
        where: { id: voucherId },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      })
    }

    // Create notification for admin
    await prisma.notification.create({
      data: {
        title: 'Đơn hàng mới',
        message: `Khách hàng ${customerName} vừa đặt đơn hàng #${orderNumber} với tổng giá trị ${totalAmount.toLocaleString('vi-VN')}đ`,
        type: 'ORDER',
        orderId: order.id,
        read: false
      }
    })

    // Create notification for customer (order confirmation)
    await prisma.notification.create({
      data: {
        title: '✅ Đặt hàng thành công',
        message: `Đơn hàng #${orderNumber} của bạn đã được xác nhận. Tổng thanh toán: ${totalAmount.toLocaleString('vi-VN')}đ. Chúng tôi sẽ xử lý đơn hàng trong thời gian sớm nhất.`,
        type: 'SUCCESS',
        orderId: order.id,
        userId: user.id,
        read: false
      }
    })

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
