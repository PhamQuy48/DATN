const bcrypt = require('bcryptjs')

const password = 'admin123'
const saltRounds = 10

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err)
    return
  }

  console.log('Password:', password)
  console.log('Hashed password:', hash)
  console.log('\nSQL to update admin password:')
  console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@shopqm.vn';`)
})
