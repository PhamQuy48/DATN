const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function updateAdminPassword() {
  try {
    const password = 'admin123'
    const saltRounds = 10

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    console.log('Hashing password...')
    console.log('Plain password:', password)
    console.log('Hashed password:', hashedPassword)

    // Update admin user
    const updatedUser = await prisma.user.update({
      where: {
        email: 'admin@shopqm.vn'
      },
      data: {
        password: hashedPassword
      }
    })

    console.log('\n✅ Password updated successfully!')
    console.log('User:', updatedUser.email, '- Role:', updatedUser.role)

    // Verify the password works
    const isValid = await bcrypt.compare(password, hashedPassword)
    console.log('Password verification:', isValid ? '✅ Valid' : '❌ Invalid')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminPassword()
