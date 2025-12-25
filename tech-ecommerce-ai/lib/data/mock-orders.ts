export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'
export type PaymentMethod = 'cod' | 'card' | 'momo' | 'bank'
export type PaymentStatus = 'pending' | 'paid' | 'refunded'

export type OrderItem = {
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
}

export type Order = {
  id: string
  orderNumber: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  shippingAddress: string
  note?: string
  createdAt: string
  updatedAt: string
}

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    userId: '2',
    userName: 'Trần Thị Lan',
    userEmail: 'lan.tran@gmail.com',
    userPhone: '0912345678',
    items: [
      {
        productId: '1',
        productName: 'MacBook Pro 16" M3 Max 2024',
        productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        quantity: 1,
        price: 89990000,
      },
    ],
    subtotal: 89990000,
    shippingFee: 0,
    total: 89990000,
    status: 'delivered',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    shippingAddress: '456 Nguyễn Huệ, Quận 1, TP.HCM',
    createdAt: '2024-11-01',
    updatedAt: '2024-11-05',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    userId: '3',
    userName: 'Lê Văn Minh',
    userEmail: 'minh.le@yahoo.com',
    userPhone: '0923456789',
    items: [
      {
        productId: '3',
        productName: 'iPhone 15 Pro Max 256GB',
        productImage: 'https://images.unsplash.com/photo-1696446702093-a630f24f6e15',
        quantity: 1,
        price: 31990000,
      },
      {
        productId: '6',
        productName: 'AirPods Pro 2 (USB-C)',
        productImage: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7',
        quantity: 1,
        price: 6490000,
      },
    ],
    subtotal: 38480000,
    shippingFee: 0,
    total: 38480000,
    status: 'shipping',
    paymentMethod: 'momo',
    paymentStatus: 'paid',
    shippingAddress: '789 Lê Lợi, Quận 3, TP.HCM',
    createdAt: '2024-11-15',
    updatedAt: '2024-11-18',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    userId: '5',
    userName: 'Hoàng Văn Tùng',
    userEmail: 'tung.hoang@gmail.com',
    userPhone: '0945678901',
    items: [
      {
        productId: '2',
        productName: 'Dell XPS 15 9530 (2024)',
        productImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
        quantity: 2,
        price: 42990000,
      },
    ],
    subtotal: 85980000,
    shippingFee: 0,
    total: 85980000,
    status: 'confirmed',
    paymentMethod: 'bank',
    paymentStatus: 'paid',
    shippingAddress: '654 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
    note: 'Giao trong giờ hành chính',
    createdAt: '2024-11-18',
    updatedAt: '2024-11-18',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    userId: '4',
    userName: 'Phạm Thị Hương',
    userEmail: 'huong.pham@outlook.com',
    userPhone: '0934567890',
    items: [
      {
        productId: '5',
        productName: 'iPad Pro 12.9" M2 256GB',
        productImage: 'https://images.unsplash.com/photo-1585790050230-5dd28404f07a',
        quantity: 1,
        price: 28990000,
      },
    ],
    subtotal: 28990000,
    shippingFee: 30000,
    total: 29020000,
    status: 'pending',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    shippingAddress: '321 Trần Hưng Đạo, Quận 5, TP.HCM',
    createdAt: '2024-11-19',
    updatedAt: '2024-11-19',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    userId: '8',
    userName: 'Bùi Thị Thu',
    userEmail: 'thu.bui@yahoo.com',
    userPhone: '0978901234',
    items: [
      {
        productId: '4',
        productName: 'Samsung Galaxy S24 Ultra 512GB',
        productImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c',
        quantity: 1,
        price: 33990000,
      },
      {
        productId: '7',
        productName: 'Logitech MX Master 3S',
        productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
        quantity: 1,
        price: 2490000,
      },
    ],
    subtotal: 36480000,
    shippingFee: 0,
    total: 36480000,
    status: 'delivered',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    shippingAddress: '258 Cách Mạng Tháng 8, Quận 3, TP.HCM',
    createdAt: '2024-11-10',
    updatedAt: '2024-11-14',
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    userId: '7',
    userName: 'Vũ Văn Hải',
    userEmail: 'hai.vu@gmail.com',
    userPhone: '0967890123',
    items: [
      {
        productId: '8',
        productName: 'ASUS ROG Zephyrus G14 2024',
        productImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
        quantity: 1,
        price: 39990000,
      },
    ],
    subtotal: 39990000,
    shippingFee: 0,
    total: 39990000,
    status: 'shipping',
    paymentMethod: 'momo',
    paymentStatus: 'paid',
    shippingAddress: '147 Hai Bà Trưng, Quận 1, TP.HCM',
    createdAt: '2024-11-16',
    updatedAt: '2024-11-17',
  },
  {
    id: '7',
    orderNumber: 'ORD-2024-007',
    userId: '11',
    userName: 'Trương Văn Đức',
    userEmail: 'duc.truong@gmail.com',
    userPhone: '0901234568',
    items: [
      {
        productId: '7',
        productName: 'Logitech MX Master 3S',
        productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
        quantity: 3,
        price: 2490000,
      },
    ],
    subtotal: 7470000,
    shippingFee: 30000,
    total: 7500000,
    status: 'cancelled',
    paymentMethod: 'cod',
    paymentStatus: 'refunded',
    shippingAddress: '852 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
    note: 'Khách hủy đơn',
    createdAt: '2024-11-12',
    updatedAt: '2024-11-13',
  },
  {
    id: '8',
    orderNumber: 'ORD-2024-008',
    userId: '12',
    userName: 'Phan Thị Nga',
    userEmail: 'nga.phan@yahoo.com',
    userPhone: '0912345679',
    items: [
      {
        productId: '1',
        productName: 'MacBook Pro 16" M3 Max 2024',
        productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        quantity: 1,
        price: 89990000,
      },
      {
        productId: '6',
        productName: 'AirPods Pro 2 (USB-C)',
        productImage: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7',
        quantity: 2,
        price: 6490000,
      },
    ],
    subtotal: 102970000,
    shippingFee: 0,
    total: 102970000,
    status: 'pending',
    paymentMethod: 'bank',
    paymentStatus: 'pending',
    shippingAddress: '963 Lê Văn Sỹ, Quận 3, TP.HCM',
    createdAt: '2024-11-20',
    updatedAt: '2024-11-20',
  },
]
