const bcrypt = require('bcryptjs')

// Lấy tham số từ command line
const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.log('Cách sử dụng: node scripts/quick-password.js <email> <password>')
  console.log('Ví dụ: node scripts/quick-password.js admin@shopqm.vn 123456')
  process.exit(1)
}

async function hashAndUpdate() {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    console.log('\n✅ Đã tạo mật khẩu mã hóa!')
    console.log('\n📋 Mật khẩu đã mã hóa:')
    console.log(hashedPassword)
    
    console.log('\n📝 Lệnh SQL để cập nhật:')
    const sqlCommand = `"C:\xampp\mysql\bin\mysql.exe" -u root -e "USE shopqm_db; UPDATE users SET password = '${hashedPassword}' WHERE email = '${email}';"`
    console.log(sqlCommand)
    
    // Thực thi luôn
    const { execSync } = require('child_process')
    console.log('\n🔄 Đang cập nhật vào database...')
    execSync(sqlCommand, { stdio: 'inherit' })
    
    console.log('\n✅ Cập nhật thành công!')
    console.log(`Email: ${email}`)
    console.log(`Mật khẩu mới: ${password}`)
  } catch (error) {
    console.error('❌ Lỗi:', error.message)
  }
}

hashAndUpdate()
