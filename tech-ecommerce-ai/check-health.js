#!/usr/bin/env node

/**
 * ShopQM Health Check Script
 * Kiểm tra trạng thái hệ thống và phát hiện vấn đề
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔍 ShopQM Health Check\n')

let hasErrors = false
let hasWarnings = false

// Helper function
function check(name, fn) {
  try {
    const result = fn()
    if (result === true) {
      console.log(`✅ ${name}`)
    } else if (result === null) {
      console.log(`⚠️  ${name}`)
      hasWarnings = true
    } else {
      console.log(`❌ ${name}`)
      hasErrors = true
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`)
    hasErrors = true
  }
}

console.log('📦 Dependencies Check\n')

check('Node.js installed', () => {
  const version = process.version
  const major = parseInt(version.slice(1).split('.')[0])
  if (major >= 18) {
    console.log(`   Version: ${version}`)
    return true
  } else {
    console.log(`   Version: ${version} (Need >= 18)`)
    return false
  }
})

check('npm installed', () => {
  try {
    const version = execSync('npm --version', { encoding: 'utf-8' }).trim()
    console.log(`   Version: ${version}`)
    return true
  } catch {
    return false
  }
})

check('node_modules exists', () => {
  return fs.existsSync(path.join(__dirname, 'node_modules'))
})

console.log('\n🗄️  Database Check\n')

check('MySQL running on port 3306', () => {
  try {
    if (process.platform === 'win32') {
      const result = execSync('netstat -ano | findstr :3306', { encoding: 'utf-8' })
      return result.includes('3306')
    } else {
      const result = execSync('lsof -i :3306', { encoding: 'utf-8' })
      return result.length > 0
    }
  } catch {
    console.log('   ⚠️  Cannot detect MySQL - make sure XAMPP/MySQL is running')
    return false
  }
})

check('.env file exists', () => {
  return fs.existsSync(path.join(__dirname, '.env'))
})

check('.env has DATABASE_URL', () => {
  if (!fs.existsSync(path.join(__dirname, '.env'))) return null
  const env = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8')
  return env.includes('DATABASE_URL')
})

console.log('\n📁 Project Structure\n')

check('prisma/schema.prisma exists', () => {
  return fs.existsSync(path.join(__dirname, 'prisma', 'schema.prisma'))
})

check('app directory exists', () => {
  return fs.existsSync(path.join(__dirname, 'app'))
})

check('components directory exists', () => {
  return fs.existsSync(path.join(__dirname, 'components'))
})

check('lib directory exists', () => {
  return fs.existsSync(path.join(__dirname, 'lib'))
})

console.log('\n🔧 Configuration Check\n')

check('package.json exists', () => {
  return fs.existsSync(path.join(__dirname, 'package.json'))
})

check('tsconfig.json exists', () => {
  return fs.existsSync(path.join(__dirname, 'tsconfig.json'))
})

check('next.config.ts exists', () => {
  return fs.existsSync(path.join(__dirname, 'next.config.ts'))
})

console.log('\n🧪 Code Quality\n')

check('TypeScript compilation', () => {
  try {
    execSync('npx tsc --noEmit', {
      encoding: 'utf-8',
      stdio: 'pipe'
    })
    return true
  } catch (error) {
    const output = error.stdout || error.stderr || ''
    const errorCount = (output.match(/error TS/g) || []).length
    if (errorCount > 0) {
      console.log(`   Found ${errorCount} TypeScript errors`)
      console.log('   Run: npx tsc --noEmit to see details')
      return false
    }
    return true
  }
})

console.log('\n📊 Summary\n')

if (!hasErrors && !hasWarnings) {
  console.log('🎉 All checks passed! System is healthy.\n')
  console.log('Next steps:')
  console.log('  1. Start database: XAMPP → Start MySQL')
  console.log('  2. Seed data: npm run db:seed')
  console.log('  3. Start dev server: npm run dev')
  console.log('  4. Open: http://localhost:3000\n')
  process.exit(0)
} else if (hasErrors) {
  console.log('❌ Some checks failed. Please fix errors above.\n')
  console.log('Common fixes:')
  console.log('  - Install dependencies: npm install')
  console.log('  - Start MySQL: Open XAMPP Control Panel')
  console.log('  - Create .env: cp .env.example .env')
  console.log('  - Check TypeScript: npx tsc --noEmit\n')
  process.exit(1)
} else {
  console.log('⚠️  Some warnings detected. System may work but not optimal.\n')
  console.log('Recommendations:')
  console.log('  - Verify MySQL is running')
  console.log('  - Check .env configuration')
  console.log('  - Run: npm run db:seed\n')
  process.exit(0)
}
