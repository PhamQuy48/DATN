# Test Hệ Thống Thông Báo

## ✅ Các Thông Báo Đã Được Thêm

### 1. **Thông báo xác nhận đơn hàng** (cho khách hàng)
- **Khi nào:** Ngay sau khi khách hàng đặt hàng thành công
- **File:** `app/api/orders/route.ts` (dòng 219-229)
- **Nội dung:**
  ```
  Tiêu đề: ✅ Đặt hàng thành công
  Thông điệp: Đơn hàng #DH12345678 của bạn đã được xác nhận.
              Tổng thanh toán: 34,990,000đ.
              Chúng tôi sẽ xử lý đơn hàng trong thời gian sớm nhất.
  Loại: SUCCESS
  ```

### 2. **Thông báo hủy đơn hàng** (cho khách hàng)
- **Khi nào:** Khi khách hàng hủy đơn hàng (chỉ đơn PENDING)
- **File:** `app/api/orders/[id]/cancel/route.ts` (dòng 68-78)
- **Nội dung:**
  ```
  Tiêu đề: ❌ Đơn hàng đã hủy
  Thông điệp: Đơn hàng #DH12345678 của bạn đã được hủy thành công.
              Số lượng sản phẩm đã được hoàn lại kho.
  Loại: WARNING
  ```

### 3. **Thông báo cập nhật trạng thái** (đã có sẵn)
- **Khi nào:** Admin/Staff cập nhật trạng thái đơn hàng
- **File:** `app/api/orders/[id]/route.ts`
- **Các trạng thái:**
  - `PROCESSING`: "Đơn hàng đang được xử lý"
  - `SHIPPING`: "Đơn hàng đang giao" ← **Đây là thông báo bạn cần**
  - `COMPLETED`: "Đơn hàng hoàn thành"
  - `CANCELLED`: "Đơn hàng đã hủy"
  - `REFUNDING`: "Đang xử lý hoàn tiền"

### 4. **Thông báo voucher** (đã có sẵn)
- **Khi nào:** Admin gửi voucher qua email hoặc notification
- **File:** `app/api/admin/vouchers/send-email/route.ts`
- **Nội dung:**
  ```
  Tiêu đề: 🎁 Bạn nhận được mã giảm giá mới!
  Thông điệp: Bạn vừa nhận được mã giảm giá SALE20 giảm 20%.
              Hãy sử dụng ngay để nhận ưu đãi!
  Loại: VOUCHER
  ```

---

## 🧪 Hướng Dẫn Test

### Chuẩn bị:
```bash
# 1. Đảm bảo MySQL đang chạy (XAMPP)
# 2. Khởi động backend
cd tech-ecommerce-ai
npm run dev
```

### Test 1: Thông Báo Xác Nhận Đơn Hàng

#### Trên Web:
1. Đăng nhập với tài khoản customer:
   - Email: `aq@gmail.com`
   - Password: `123456`

2. Thêm sản phẩm vào giỏ hàng
3. Vào trang Checkout (`/checkout`)
4. Điền thông tin và đặt hàng
5. **Kiểm tra thông báo:**
   - Click icon chuông (🔔) ở header
   - Phải thấy thông báo "✅ Đặt hàng thành công"

#### Trên Mobile App:
1. Mở app và đăng nhập với `aq@gmail.com`
2. Thêm sản phẩm vào giỏ → Checkout
3. Đặt hàng thành công
4. Vào tab "Tài khoản" → "Thông báo"
5. Phải thấy notification mới

#### Kiểm tra Database:
```bash
cd tech-ecommerce-ai
"C:\xampp\mysql\bin\mysql.exe" -u root -e "USE shopqm_db; SELECT title, message, type, userId, orderId, read FROM notifications ORDER BY createdAt DESC LIMIT 5;"
```

**Kết quả mong đợi:**
- 1 notification cho Admin (userId = NULL, type = ORDER)
- 1 notification cho Customer (userId = [customer_id], type = SUCCESS)

---

### Test 2: Thông Báo Hủy Đơn Hàng

#### Trên Web:
1. Đăng nhập customer: `aq@gmail.com`
2. Vào "Đơn hàng của tôi" (`/orders`)
3. Chọn đơn hàng có trạng thái **PENDING**
4. Click "Hủy đơn hàng"
5. Xác nhận hủy
6. **Kiểm tra thông báo:**
   - Click icon chuông (🔔)
   - Phải thấy "❌ Đơn hàng đã hủy"

#### Kiểm tra Database:
```sql
SELECT title, message, type, userId
FROM notifications
WHERE title LIKE '%hủy%'
ORDER BY createdAt DESC LIMIT 3;
```

---

### Test 3: Thông Báo Đơn Hàng Đang Vận Chuyển

#### Admin cập nhật:
1. Đăng nhập Admin: `anhquy20348@gmail.com` / `123456`
2. Vào `/admin/orders`
3. Chọn 1 đơn hàng PENDING
4. Cập nhật trạng thái: PENDING → PROCESSING → **SHIPPING**
5. Lưu

#### Customer kiểm tra:
1. Đăng nhập customer (chủ đơn hàng)
2. Click icon thông báo (🔔)
3. **Phải thấy 2 thông báo:**
   - "Đơn hàng đang được xử lý" (PROCESSING)
   - "Đơn hàng đang giao" (SHIPPING) ← **Đây là thông báo bạn cần**

---

### Test 4: Thông Báo Voucher

#### Admin gửi voucher:
1. Đăng nhập Admin
2. Vào `/admin/vouchers`
3. Tạo voucher mới (VD: SALE30)
4. Click "Gửi Email" hoặc "Gửi thông báo"
5. Chọn customers muốn gửi
6. Xác nhận gửi

#### Customer kiểm tra:
1. Check email (nếu gửi qua email)
2. Click icon thông báo (🔔)
3. Phải thấy "🎁 Bạn nhận được mã giảm giá mới!"

---

## 📊 Kiểm Tra Nhanh Bằng SQL

### Xem tất cả thông báo của 1 customer:
```sql
SELECT
  n.title,
  n.message,
  n.type,
  n.read,
  n.createdAt,
  o.orderNumber
FROM notifications n
LEFT JOIN orders o ON n.orderId = o.id
WHERE n.userId = 'cmj8cygez00007kb4tj7a38zd'  -- ID của aq@gmail.com
ORDER BY n.createdAt DESC;
```

### Xem notifications chưa đọc:
```sql
SELECT
  userId,
  title,
  type,
  createdAt
FROM notifications
WHERE userId IS NOT NULL AND `read` = 0
ORDER BY createdAt DESC
LIMIT 10;
```

### Đếm số lượng notifications theo loại:
```sql
SELECT
  type,
  `read`,
  COUNT(*) as count
FROM notifications
WHERE userId IS NOT NULL
GROUP BY type, `read`;
```

---

## ✅ Checklist Test

- [ ] Test đặt hàng thành công → Có thông báo xác nhận
- [ ] Test hủy đơn hàng → Có thông báo hủy
- [ ] Test admin cập nhật SHIPPING → Customer nhận thông báo
- [ ] Test admin gửi voucher → Customer nhận thông báo
- [ ] Test đánh dấu đã đọc → Badge số giảm
- [ ] Test xóa thông báo → Thông báo biến mất
- [ ] Test trên Mobile app → Tất cả notifications hiển thị

---

## 🎯 Tóm Tắt Luồng Thông Báo

```
┌─────────────────────────────────────────────────────────────┐
│                    KHÁCH HÀNG NHẬN THÔNG BÁO                │
└─────────────────────────────────────────────────────────────┘

1. Đặt hàng thành công
   → ✅ "Đặt hàng thành công" (type: SUCCESS)

2. Admin cập nhật: PENDING → PROCESSING
   → ℹ️ "Đơn hàng đang được xử lý" (type: INFO)

3. Admin cập nhật: PROCESSING → SHIPPING
   → ℹ️ "Đơn hàng đang giao" (type: INFO) ← BẠN CẦN CÁI NÀY

4. Admin cập nhật: SHIPPING → COMPLETED
   → ✅ "Đơn hàng hoàn thành" (type: SUCCESS)

5. Khách hàng hủy đơn (chỉ PENDING)
   → ⚠️ "Đơn hàng đã hủy" (type: WARNING)

6. Admin gửi voucher
   → 🎁 "Bạn nhận được mã giảm giá mới!" (type: VOUCHER)

┌─────────────────────────────────────────────────────────────┐
│                      ADMIN NHẬN THÔNG BÁO                   │
└─────────────────────────────────────────────────────────────┘

1. Khách đặt hàng mới
   → 🛒 "Đơn hàng mới" (type: ORDER, userId: null)
```

---

## 🔧 Nếu Không Thấy Thông Báo

### 1. Kiểm tra notifications trong DB:
```bash
"C:\xampp\mysql\bin\mysql.exe" -u root -e "USE shopqm_db; SELECT COUNT(*) FROM notifications WHERE userId IS NOT NULL;"
```

### 2. Kiểm tra server logs:
- Mở terminal đang chạy `npm run dev`
- Xem có lỗi khi tạo notification không

### 3. Kiểm tra API:
```bash
# Test API get notifications (thay YOUR_AUTH_TOKEN)
curl http://localhost:3004/api/notifications -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

### 4. Clear cache:
```bash
# Web: Ctrl+Shift+R (hard reload)
# Mobile: Stop app → Clear cache → Restart
```

---

**Lưu ý:**
- Thông báo chỉ gửi cho customer khi có `userId`
- Admin notification có `userId = null`
- Mỗi lần đổi status sẽ tạo 1 notification mới
- Voucher notification có thể gửi hàng loạt

Chúc test thành công! 🎉
