# 🧪 Test Chức Năng Thông Báo Tự Động

## Mục đích
Test hệ thống thông báo hoạt động **TỰ ĐỘNG** cho mọi customer, không phải demo data.

---

## ✅ Các chức năng tự động đã hoàn chỉnh:

1. **Customer đặt hàng** → Nhận notification "Đặt hàng thành công"
2. **Customer hủy đơn** → Nhận notification "Đơn hàng đã hủy"
3. **Admin cập nhật trạng thái đơn** → Customer nhận notification (Đang xử lý, Đang giao, Hoàn thành, v.v.)
4. **Admin tạo voucher** → Customer nhận notification voucher

---

## 🔥 TEST 1: Customer đặt hàng mới (TỰ ĐỘNG)

### Bước 1: Đăng ký hoặc đăng nhập customer
```
Mở: http://localhost:3004
Đăng nhập: bất kỳ customer nào (VD: PL@gmail.com / 123456)
Hoặc đăng ký account mới
```

### Bước 2: Đặt hàng sản phẩm
```
1. Vào trang Shop
2. Thêm sản phẩm vào giỏ hàng
3. Checkout và điền thông tin giao hàng
4. Nhấn "Đặt hàng"
```

### Bước 3: Kiểm tra notification
```
1. Sau khi đặt hàng thành công
2. Click icon chuông (🔔) ở header
3. Phải thấy notification MỚI:
   ✅ Đặt hàng thành công
   Đơn hàng #DH00000XXX của bạn đã được xác nhận.
   Tổng thanh toán: XXXđ.
```

**Kết quả mong đợi:**
- ✅ Notification tự động xuất hiện ngay sau khi đặt hàng
- ✅ Badge đỏ hiện số lượng thông báo chưa đọc
- ✅ Nội dung đúng với đơn hàng vừa đặt

---

## 🔥 TEST 2: Admin cập nhật trạng thái đơn (TỰ ĐỘNG)

### Bước 1: Đăng nhập Admin
```
Đăng xuất customer
Đăng nhập admin: anhquy20348@gmail.com / 123456
```

### Bước 2: Cập nhật trạng thái đơn hàng
```
1. Vào: http://localhost:3004/admin/orders
2. Tìm đơn hàng vừa tạo (từ TEST 1)
3. Click vào đơn hàng đó
4. Thay đổi status:
   PENDING → PROCESSING (Đang xử lý)
5. Nhấn "Update Order"
```

### Bước 3: Đăng nhập lại customer và kiểm tra
```
1. Đăng xuất admin
2. Đăng nhập lại customer (account vừa đặt hàng)
3. Click chuông (🔔)
4. Phải thấy notification MỚI:
   ℹ️ Đơn hàng đang được xử lý
   Đơn hàng #DH00000XXX của bạn đang được chuẩn bị
```

### Bước 4: Test thêm các trạng thái khác
```
Lặp lại với các status:
- PROCESSING → SHIPPING (Đang giao)
- SHIPPING → COMPLETED (Hoàn thành)

Mỗi lần đổi status → Customer nhận notification mới
```

**Kết quả mong đợi:**
- ✅ Mỗi lần admin đổi status → Customer tự động nhận notification
- ✅ Badge chuông tăng số lượng thông báo chưa đọc
- ✅ Nội dung notification đúng với trạng thái mới

---

## 🔥 TEST 3: Customer hủy đơn hàng (TỰ ĐỘNG)

### Bước 1: Đặt hàng mới
```
Đăng nhập customer → Đặt hàng mới
(Làm như TEST 1)
```

### Bước 2: Hủy đơn hàng
```
1. Vào: http://localhost:3004/profile/orders
2. Click vào đơn hàng vừa tạo (status: PENDING)
3. Nhấn nút "Hủy đơn hàng" (Cancel Order)
4. Xác nhận hủy
```

### Bước 3: Kiểm tra notification
```
1. Click chuông (🔔)
2. Phải thấy notification MỚI:
   ❌ Đơn hàng đã hủy
   Đơn hàng #DH00000XXX của bạn đã được hủy thành công.
   Số lượng sản phẩm đã được hoàn lại kho.
```

**Kết quả mong đợi:**
- ✅ Notification tự động xuất hiện sau khi hủy đơn
- ✅ Type: WARNING (màu vàng/cam)
- ✅ Nội dung thông báo hủy đơn thành công

---

## 🔥 TEST 4: Admin tạo voucher cho customer (TỰ ĐỘNG)

### Bước 1: Đăng nhập Admin
```
Đăng nhập: anhquy20348@gmail.com / 123456
```

### Bước 2: Tạo voucher
```
1. Vào: http://localhost:3004/admin/vouchers
2. Click "Create Voucher" hoặc "Tạo voucher mới"
3. Điền thông tin:
   - Code: WELCOME2024
   - Discount: 100000 (100k VNĐ)
   - Type: FIXED_AMOUNT
   - Assign to user: chọn customer account
4. Nhấn "Create"
```

### Bước 3: Kiểm tra notification ở customer
```
1. Đăng xuất admin
2. Đăng nhập customer (account được assign voucher)
3. Click chuông (🔔)
4. Phải thấy notification MỚI:
   🎁 Bạn nhận được voucher mới!
   Code: WELCOME2024
   Giảm giá: 100,000đ
```

**Kết quả mong đợi:**
- ✅ Customer tự động nhận notification khi admin tạo voucher
- ✅ Type: VOUCHER
- ✅ Hiển thị đầy đủ thông tin voucher

---

## 🔥 TEST 5: Account mới đăng ký (TỰ ĐỘNG)

### Bước 1: Đăng ký account mới
```
1. Đăng xuất tất cả
2. Vào: http://localhost:3004/register
3. Đăng ký với email mới:
   Email: test_new_user@gmail.com
   Password: 123456
   Name: Test User
```

### Bước 2: Đặt hàng với account mới
```
Làm theo TEST 1 với account mới này
```

### Bước 3: Kiểm tra notifications
```
Click chuông (🔔)
→ Phải thấy notification "Đặt hàng thành công"
```

**Kết quả mong đợi:**
- ✅ Account mới đăng ký cũng nhận được notifications tự động
- ✅ Không cần setup gì thêm
- ✅ Hệ thống hoạt động cho MỌI customer

---

## 🎯 Checklist tổng hợp

- [ ] TEST 1: Customer đặt hàng → Nhận notification tự động
- [ ] TEST 2: Admin đổi status → Customer nhận notification tự động
- [ ] TEST 3: Customer hủy đơn → Nhận notification tự động
- [ ] TEST 4: Admin tạo voucher → Customer nhận notification tự động
- [ ] TEST 5: Account mới đăng ký → Tất cả chức năng đều hoạt động

---

## 🐛 Nếu notification KHÔNG tự động xuất hiện

### 1. Kiểm tra server đã restart chưa
```bash
Ctrl + C (stop server)
cd tech-ecommerce-ai
npm run dev
```

### 2. Kiểm tra database charset
```bash
"C:\xampp\mysql\bin\mysql.exe" -u root -e "SHOW VARIABLES LIKE 'character_set%';"
```

Phải thấy:
```
character_set_database | utf8mb4
```

### 3. Hard refresh browser
```
Ctrl + Shift + R
Hoặc xóa cookies và đăng nhập lại
```

### 4. Kiểm tra Console (F12)
```
F12 → Console tab
Tìm errors liên quan đến notifications
```

### 5. Test API trực tiếp
```javascript
// Mở Console (F12) và gõ:
fetch('/api/notifications?limit=10')
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## ✅ Kết luận

Hệ thống thông báo **ĐÃ HOÀN CHỈNH** và hoạt động **TỰ ĐỘNG** cho:
- ✅ Mọi customer đăng ký mới
- ✅ Mọi đơn hàng được tạo
- ✅ Mọi lần admin cập nhật trạng thái
- ✅ Mọi voucher được phát hành

**KHÔNG CẦN** tạo demo data thủ công!

Chỉ cần:
1. Restart server (1 lần duy nhất)
2. Test các chức năng thực tế
3. Hệ thống sẽ tự động tạo notifications

---

## 📚 Tài liệu kỹ thuật

### Code tự động tạo notifications:

1. **Đặt hàng:** `app/api/orders/route.ts:219-229`
2. **Hủy đơn:** `app/api/orders/[id]/cancel/route.ts:68-78`
3. **Cập nhật status:** `app/api/orders/[id]/route.ts:202-245`
4. **Tạo voucher:** `app/api/admin/vouchers/route.ts`

### Database Schema:

```prisma
model Notification {
  id        String   @id @default(uuid())
  title     String
  message   String   @db.Text
  type      String   // SUCCESS, INFO, WARNING, ERROR, ORDER, VOUCHER
  read      Boolean  @default(false)
  userId    String?  // Customer ID (null = cho admin)
  orderId   String?  // Liên kết với đơn hàng
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  order     Order?   @relation(fields: [orderId], references: [id], onDelete: Cascade)
}
```

### Auto-refresh:

Frontend tự động refresh notifications mỗi 30 giây:
- File: `components/layout/UserNotificationBell.tsx`
- Interval: 30000ms (30 seconds)
- Auto badge update khi có thông báo mới
