# Tech E-Commerce AI - Shop QM

## Hướng Dẫn Fix Warnings Trong VSCode

### 🔧 Setup ESLint

Đã cấu hình ESLint trong `.eslintrc.json` để tự động phát hiện và fix warnings.

### ⚡ Quick Fixes

#### 1. Auto Fix Trong VSCode

**Cách 1: Format On Save**
```json
// Thêm vào .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

**Cách 2: Manual Fix**
- Nhấn `Ctrl + Shift + P`
- Gõ "ESLint: Fix all auto-fixable Problems"
- Enter

#### 2. Fix All Files Cùng Lúc

```bash
# Trong terminal
cd tech-ecommerce-ai
npx eslint . --ext .ts,.tsx --fix
```

### 📋 Các Loại Warnings Phổ Biến

#### 1. **React Hooks Dependency Warning**

```typescript
// ❌ Warning: React Hook useEffect has missing dependencies
useEffect(() => {
  fetchData()
}, [])

// ✅ Fix 1: Add dependencies
useEffect(() => {
  fetchData()
}, [fetchData])

// ✅ Fix 2: Disable warning if intentional
useEffect(() => {
  fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
```

#### 2. **Unused Variables**

```typescript
// ❌ Warning: 'data' is assigned but never used
const data = await fetch('/api')

// ✅ Fix 1: Use underscore prefix
const _data = await fetch('/api')

// ✅ Fix 2: Remove if truly unused
await fetch('/api')
```

#### 3. **TypeScript 'any' Type**

```typescript
// ❌ Warning: Unexpected any
const handleClick = (event: any) => {}

// ✅ Fix: Use specific type
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {}
```

#### 4. **Console.log in Production**

Sử dụng logger utility thay vì console.log trực tiếp:

```typescript
// ❌ Không nên
console.log('Debug info')

// ✅ Nên dùng
import { clientLogger } from '@/lib/utils/logger'
clientLogger.log('Debug info')  // Chỉ log trong development
```

### 🛠️ Utilities Đã Tạo

#### Logger Utility (`lib/utils/logger.ts`)

```typescript
import { logger } from '@/lib/utils/logger'          // Server-side
import { clientLogger } from '@/lib/utils/logger'    // Client-side

// Sử dụng
logger.log('Server log')         // Chỉ development
logger.error('Always logged')    // Luôn log errors
clientLogger.log('Client log')   // Chỉ development
```

### 📝 ESLint Rules Configured

```json
{
  "no-console": "off",                              // Cho phép console (dùng logger)
  "react-hooks/exhaustive-deps": "warn",            // Warn về missing deps
  "@typescript-eslint/no-explicit-any": "warn",     // Warn về 'any' type
  "@typescript-eslint/no-unused-vars": "warn",      // Warn về unused vars
  "@next/next/no-img-element": "warn"               // Warn về <img> tag
}
```

### 🎯 Các Bước Loại Bỏ Warnings

1. **Restart TypeScript Server**
   - `Ctrl + Shift + P`
   - Gõ "TypeScript: Restart TS Server"

2. **Reload Window**
   - `Ctrl + Shift + P`
   - Gõ "Developer: Reload Window"

3. **Check Problems Tab**
   - `Ctrl + Shift + M` hoặc View → Problems
   - Xem danh sách warnings

4. **Fix Từng File**
   - Click vào warning
   - Nhấn `Ctrl + .` (Quick Fix)
   - Chọn fix phù hợp

### 🚀 Development Workflow

```bash
# 1. Start dev server
npm run dev

# 2. Check TypeScript errors
npx tsc --noEmit

# 3. Check ESLint warnings
npx eslint . --ext .ts,.tsx

# 4. Auto-fix what's possible
npx eslint . --ext .ts,.tsx --fix

# 5. Format code
npx prettier --write .
```

### 📦 Production Build

```bash
# Build sẽ fail nếu có TypeScript errors
npm run build

# Build và ignore warnings
CI=false npm run build
```

### 💡 Tips

1. **Ignore Specific Line**
   ```typescript
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const data: any = {}
   ```

2. **Ignore Entire File**
   ```typescript
   /* eslint-disable @typescript-eslint/no-explicit-any */
   // File content here
   ```

3. **Temporary Disable**
   ```typescript
   /* eslint-disable */
   // Problematic code
   /* eslint-enable */
   ```

### 🔍 Common Fixes

#### Fix Image Warnings

```typescript
// ❌ Warning: Using <img> tag
<img src="/logo.png" alt="Logo" />

// ✅ Use Next.js Image
import Image from 'next/image'
<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

#### Fix Link Warnings

```typescript
// ❌ Warning: Using <a> for internal links
<a href="/products">Products</a>

// ✅ Use Next.js Link
import Link from 'next/link'
<Link href="/products">Products</Link>
```

### 📚 Resources

- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript Config](https://www.typescriptlang.org/tsconfig)
- [Next.js ESLint](https://nextjs.org/docs/basic-features/eslint)

---

## Project Structure

```
tech-ecommerce-ai/
├── app/                  # Next.js 15 App Router
├── components/           # React components
├── lib/                  # Utilities & helpers
│   └── utils/
│       └── logger.ts    # ✅ Logger utility
├── prisma/              # Database schema
├── public/              # Static files
├── .eslintrc.json       # ✅ ESLint config
├── .gitignore           # ✅ Git ignore rules
└── README.md            # This file
```

## Environment Variables

```env
# Required
DATABASE_URL="mysql://root@localhost:3306/shopqm_db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional
NEXT_PUBLIC_DEBUG="true"    # Enable debug logging
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Production Checklist

- [ ] Set `NEXT_PUBLIC_DEBUG=false` in production
- [ ] Remove all `.md` files except README.md
- [ ] Fix all TypeScript errors
- [ ] Fix critical ESLint warnings
- [ ] Test all features
- [ ] Run `npm run build` successfully

---

**Last Updated:** 2025-12-26
**Version:** 1.0.0
