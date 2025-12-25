# 🚀 QUICK START - CHẠY DỰ ÁN NGAY

## ✅ Checklist hoàn thành

### 1️⃣ Cài đặt cơ bản
- [x] Node.js đã cài
- [x] MySQL đã cài
- [x] Dependencies đã install (`npm install`)
- [x] Database đã tạo (`shopqm_db`)
- [x] Prisma đã migrate (`npx prisma db push`)

### 2️⃣ Chạy server
```bash
cd tech-ecommerce-ai
npm run dev
```

### 3️⃣ Truy cập
- 🏠 Trang chủ: http://localhost:3004
- 🔐 Đăng nhập: http://localhost:3004/login
- 👨‍💼 Admin: http://localhost:3004/admin/login
- 👔 Staff: http://localhost:3004/staff/login

---

## 🎯 Tính năng đã hoạt động

### ✅ HOÀN TOÀN SẴN SÀNG
- Đăng ký/Đăng nhập Email/Password
- Quản lý sản phẩm (CRUD)
- Giỏ hàng & Checkout
- Voucher system
- Thông báo real-time
- AI Chat & Visual Search
- Email marketing
- Quên mật khẩu (OTP)
- Review & Rating
- Admin Dashboard

### ⏳ CẦN CẤU HÌNH (Không bắt buộc)
- ❌ Google OAuth Login → Xem file [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)
- ⚠️ Email Service (Reset password) → Cấu hình Gmail SMTP trong `.env`

---

## 📧 Email Configuration (Cho tính năng Quên mật khẩu)

### Cách lấy Gmail App Password:

1. Vào https://myaccount.google.com/security
2. Bật "2-Step Verification"
3. Vào https://myaccount.google.com/apppasswords
4. Chọn "Mail" → "Other (Custom name)"
5. Nhập "Shop QM" → Create
6. Copy 16-digit password

### Cập nhật .env:
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-gmail@gmail.com"
EMAIL_PASSWORD="abcd efgh ijkl mnop"  # 16-digit app password
EMAIL_FROM="SHOP QM <your-gmail@gmail.com>"
```

---

## 🔐 Tài khoản demo

### Customer
- Email: `user@example.com`
- Password: `123456`
- URL: http://localhost:3004/login

### Admin
Tạo tài khoản admin bằng cách:
1. Đăng ký tài khoản mới
2. Vào MySQL và update role:
```sql
USE shopqm_db;
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
```

### Staff
Tương tự admin nhưng update role = 'STAFF'

---

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to database"
```bash
# Kiểm tra MySQL đang chạy
mysql -u root -p

# Kiểm tra database tồn tại
SHOW DATABASES;

# Nếu chưa có, tạo database
CREATE DATABASE shopqm_db;
```

### Lỗi: "Google OAuth not working"
✅ Đã fix! Google OAuth tạm thời bị tắt. Xem file [GOOGLE_LOGIN_FIX.md](./GOOGLE_LOGIN_FIX.md)

### Lỗi: "Port 3004 already in use"
```bash
# Windows: Kill process
netstat -ano | findstr :3004
taskkill /PID <PID> /F

# Hoặc đổi port trong package.json
"dev": "next dev -p 3005"
```

### Lỗi: "Prisma Client not found"
```bash
npx prisma generate
npm run dev
```

---

## 📚 Files quan trọng

| File | Mục đích |
|------|----------|
| `.env` | Cấu hình database, API keys |
| `prisma/schema.prisma` | Database schema |
| `GOOGLE_OAUTH_SETUP.md` | Hướng dẫn cấu hình Google Login |
| `GOOGLE_LOGIN_FIX.md` | Giải thích lỗi Google OAuth |
| `BAO-CAO-DO-AN.md` | Báo cáo đồ án đầy đủ |

---

## 🎓 Học cách sử dụng

### 1. Xem sản phẩm
- Vào http://localhost:3004
- Duyệt sản phẩm, tìm kiếm, lọc

### 2. Mua hàng
- Thêm vào giỏ
- Checkout
- Nhập mã voucher (nếu có)
- Đặt hàng

### 3. Quản lý (Admin)
- Đăng nhập admin
- Thêm/sửa/xóa sản phẩm
- Quản lý đơn hàng
- Tạo voucher
- Xem thống kê

### 4. AI Features
- Chat với AI: `/ai-assistant`
- Visual Search: Upload ảnh sản phẩm
- AI tư vấn sản phẩm

---

## ✨ Tính năng hay

1. **Real-time Notifications**
   - Admin nhận thông báo khi có đơn mới
   - User nhận thông báo khi đơn thay đổi trạng thái

2. **Voucher System**
   - Giảm theo % hoặc số tiền
   - Giới hạn sử dụng
   - Thời hạn có hiệu lực

3. **AI Visual Search**
   - Chụp/upload ảnh sản phẩm
   - AI tìm sản phẩm tương tự

4. **Password Reset**
   - OTP 6 số gửi qua email
   - Token 15 phút
   - One-time use

---

## 🎉 Bắt đầu thôi!

```bash
# 1. Chạy server
npm run dev

# 2. Mở trình duyệt
http://localhost:3004

# 3. Enjoy! 🚀
```

---

Nếu gặp vấn đề, check:
1. Terminal có lỗi gì không
2. Browser Console (F12) có lỗi không
3. MySQL đang chạy không
4. File .env đã cấu hình đúng chưa
