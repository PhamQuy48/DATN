// Script tạo user test cho mobile app
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Đang tạo user test...')

  const testEmail = 'test@shopqm.com'
  const testPassword = '123456'

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: testEmail }
  })

  if (existingUser) {
    console.log('✅ User test đã tồn tại!')
    console.log('📧 Email:', testEmail)
    console.log('🔑 Password:', testPassword)
    return
  }

  // Create new user
  const hashedPassword = await bcrypt.hash(testPassword, 10)

  const user = await prisma.user.create({
    data: {
      email: testEmail,
      password: hashedPassword,
      name: 'Test User',
      role: 'CUSTOMER',
      phone: '0123456789',
      address: 'Hà Nội, Việt Nam',
      banned: false,
    }
  })

  console.log('✅ Đã tạo user test thành công!')
  console.log('📧 Email:', testEmail)
  console.log('🔑 Password:', testPassword)
  console.log('👤 User ID:', user.id)
  console.log('')
  console.log('💡 Bây giờ bạn có thể login vào app với:')
  console.log('   Email: test@shopqm.com')
  console.log('   Password: 123456')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
