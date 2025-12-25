const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔄 Đang kết nối MySQL...')

    // Test connection
    await prisma.$connect()
    console.log('✅ Kết nối MySQL thành công!')

    // Count users
    const userCount = await prisma.user.count()
    console.log(`👤 Số users: ${userCount}`)

    // Count products
    const productCount = await prisma.product.count()
    console.log(`📦 Số products: ${productCount}`)

    // Count categories
    const categoryCount = await prisma.category.count()
    console.log(`📁 Số categories: ${categoryCount}`)

    console.log('\n✨ Kết nối database hoạt động tốt!')
  } catch (error) {
    console.error('❌ Lỗi kết nối MySQL:', error.message)
    console.error('Chi tiết:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
