const bcrypt = require('bcryptjs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function changePassword() {
  rl.question('Nhập email người dùng: ', async (email) => {
    rl.question('Nhập mật khẩu mới: ', async (password) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10)
        
        console.log('\n=== Thông tin cập nhật ===')
        console.log('Email:', email)
        console.log('Mật khẩu đã mã hóa:', hashedPassword)
        console.log('\n=== Chạy lệnh SQL sau ===')
        console.log(`"C:\xampp\mysql\bin\mysql.exe" -u root -e "USE shopqm_db; UPDATE users SET password = '${hashedPassword}' WHERE email = '${email}';"`)
        console.log('\nHoặc copy mật khẩu đã mã hóa và chạy UPDATE trực tiếp trong MySQL')
      } catch (error) {
        console.error('Lỗi:', error)
      }
      rl.close()
    })
  })
}

changePassword()
