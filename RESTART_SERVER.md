# 🔄 Hướng Dẫn Restart Server

## ⚠️ Bắt buộc phải restart sau khi sửa .env

Đã sửa DATABASE_URL để fix lỗi font UTF-8. **Cần restart server** để áp dụng thay đổi!

---

## 🚀 Cách Restart Server

### Bước 1: Stop Server Hiện Tại

Trong terminal đang chạy `npm run dev`:

**Nhấn:** `Ctrl + C`

Sẽ thấy:
```
^C
Terminated
```

---

### Bước 2: Restart Server

```bash
cd tech-ecommerce-ai
npm run dev
```

Chờ thấy:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3004
```

---

### Bước 3: Test Lại

1. **Mở trình duyệt:** http://localhost:3004
2. **Hard refresh:** `Ctrl + Shift + R`
3. **Đăng nhập:** `aq@gmail.com` / `123456`
4. **Click chuông** (🔔)
5. **Kiểm tra font** tiếng Việt đã đúng chưa:
   - ✅ "Đơn hàng đang giao" (đúng)
   - ❌ "ðý?c giao" (sai - cần restart)

---

## ✅ Kết Quả Mong Đợi

Sau khi restart, notifications sẽ hiển thị **tiếng Việt chuẩn**:

```
✅ Đặt hàng thành công
Đơn hàng #DH99999999 của bạn đã được xác nhận.
Tổng thanh toán: 1,000,000đ.
Chúng tôi sẽ xử lý đơn hàng trong thời gian sớm nhất.

ℹ️ Đơn hàng đang được xử lý
Đơn hàng #DH99999999 của bạn đang được chuẩn bị

ℹ️ Đơn hàng đang giao
Đơn hàng #DH99999999 đang được giao đến bạn
```

---

## 🔧 Nếu Vẫn Còn Lỗi Font

### Fix 1: Clear Next.js Cache

```bash
cd tech-ecommerce-ai

# Windows
rmdir /s .next

# Hoặc
rm -rf .next

# Restart
npm run dev
```

### Fix 2: Fix Database Charset

```sql
-- Chạy trong MySQL
ALTER DATABASE shopqm_db CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
ALTER TABLE notifications CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE orders CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Fix 3: Tạo lại Notifications

Nếu vẫn thấy notifications cũ (font lỗi), xóa và tạo lại:

```bash
"C:\xampp\mysql\bin\mysql.exe" -u root shopqm_db -e "
DELETE FROM notifications WHERE userId = 'cmj8cygez00007kb4tj7a38zd';

INSERT INTO notifications (id, title, message, type, userId, orderId, \`read\`, createdAt, updatedAt)
VALUES
  (UUID(), '✅ Đặt hàng thành công', 'Đơn hàng #DH99999999 của bạn đã được xác nhận.', 'SUCCESS', 'cmj8cygez00007kb4tj7a38zd', 'test-cust-order-1', 0, NOW(), NOW()),
  (UUID(), 'Đơn hàng đang được xử lý', 'Đơn hàng #DH99999999 của bạn đang được chuẩn bị', 'INFO', 'cmj8cygez00007kb4tj7a38zd', 'test-cust-order-1', 0, NOW(), NOW()),
  (UUID(), 'Đơn hàng đang giao', 'Đơn hàng #DH99999999 đang được giao đến bạn', 'INFO', 'cmj8cygez00007kb4tj7a38zd', 'test-cust-order-1', 0, NOW(), NOW());
"
```

---

## 🎯 Checklist

- [ ] Stop server (Ctrl+C)
- [ ] Restart server (npm run dev)
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Đăng nhập lại
- [ ] Kiểm tra font tiếng Việt

Nếu tất cả ✅ → Hoàn thành!
