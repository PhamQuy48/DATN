// Script to test notification system
// Run with: npx tsx scripts/test-notifications.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  console.log('🧪 Testing Notification System...\n')

  try {
    // 1. Check database connection
    console.log('1️⃣ Checking database connection...')
    await prisma.$connect()
    console.log('✅ Database connected\n')

    // 2. Get all users
    console.log('2️⃣ Fetching users...')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })
    console.log(`✅ Found ${users.length} users:`)
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - ID: ${user.id}`)
    })
    console.log()

    // 3. Check existing notifications
    console.log('3️⃣ Checking existing notifications...')
    const notificationCount = await prisma.notification.count()
    console.log(`✅ Total notifications in database: ${notificationCount}`)

    for (const user of users) {
      const userNotifications = await prisma.notification.count({
        where: { userId: user.id }
      })
      const unreadCount = await prisma.notification.count({
        where: { userId: user.id, read: false }
      })
      console.log(`   - ${user.email}: ${userNotifications} total (${unreadCount} unread)`)
    }
    console.log()

    // 4. Create test notification for each user
    console.log('4️⃣ Creating test notifications...')
    for (const user of users) {
      const notification = await prisma.notification.create({
        data: {
          userId: user.id,
          title: '🧪 Test Notification',
          message: `This is a test notification for ${user.email} created at ${new Date().toLocaleString('vi-VN')}`,
          type: 'INFO',
          read: false
        }
      })
      console.log(`✅ Created notification for ${user.email}:`, notification.id)
    }
    console.log()

    // 5. Verify notifications were created
    console.log('5️⃣ Verifying notifications...')
    for (const user of users) {
      const userNotifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
          type: true,
          read: true,
          createdAt: true
        }
      })
      console.log(`\n   ${user.email} - Recent notifications:`)
      userNotifications.forEach(notif => {
        console.log(`   - [${notif.type}] ${notif.title} (${notif.read ? 'Read' : 'Unread'})`)
        console.log(`     Created: ${notif.createdAt.toLocaleString('vi-VN')}`)
      })
    }
    console.log()

    console.log('🎉 Test completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Login to the website')
    console.log('2. Check the notification bell in the header')
    console.log('3. Go to /notifications page')
    console.log('4. You should see the test notifications created above')

  } catch (error) {
    console.error('❌ Error:', error)
    if (error instanceof Error) {
      console.error('Stack:', error.stack)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
