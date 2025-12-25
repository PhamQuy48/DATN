# 🔔 Hướng Dẫn Test Thông Báo Khách Hàng

## ✅ Tình Trạng Hiện Tại

Hệ thống thông báo **đã hoàn chỉnh** và **hoạt động đúng**!

### Các thông báo khách hàng nhận được:

1. **Đặt hàng thành công** ✅
   - Ngay sau khi đặt hàng
   - Type: SUCCESS
   - Icon: ✅

2. **Đơn hàng đang được xử lý** ℹ️
   - Khi admin/staff cập nhật: PENDING → PROCESSING
   - Type: INFO
   - Icon: ℹ️

3. **Đơn hàng đang giao** 🚚
   - Khi admin/staff cập nhật: PROCESSING → SHIPPING
   - Type: INFO
   - Icon: ℹ️

4. **Đơn hàng hoàn thành** ✅
   - Khi admin/staff cập nhật: SHIPPING → COMPLETED
   - Type: SUCCESS
   - Icon: ✅

5. **Đơn hàng đã hủy** ❌
   - Khi khách hàng hủy đơn PENDING
   - Type: WARNING
   - Icon: ❌

6. **Nhận voucher từ admin** 🎁
   - Khi admin gửi voucher
   - Type: VOUCHER
   - Icon: 🎁

---

## 🧪 Cách Test Đúng

### **QUAN TRỌNG:** Đăng nhập đúng tài khoản!

Thông báo chỉ hiển thị cho **chủ đơn hàng**. Nếu đơn hàng được đặt bởi admin, thông báo sẽ gửi đến admin. Nếu đơn hàng được đặt bởi customer, thông báo sẽ gửi đến customer.

### Bước 1: Khởi động Server

```bash
cd tech-ecommerce-ai
npm run dev
```

Server chạy tại: http://localhost:3004

---

### Bước 2: Đăng Nhập Customer

**Tài khoản test đã có sẵn:**
```
Email: aq@gmail.com
Password: 123456
Role: CUSTOMER
```

**Đơn hàng test đã tạo:** DH99999999
- Có 3 notifications sẵn để xem

---

### Bước 3: Kiểm Tra Thông Báo Hiện Có

1. **Đăng nhập** với `aq@gmail.com`
2. Nhìn vào **góc phải header**
3. Click vào **icon chuông** (🔔)
4. **Phải thấy:**
   - Badge đỏ hiển thị số `3`
   - Dropdown mở ra với 3 thông báo:
     - ✅ Đặt hàng thành công
     - ℹ️ Đơn hàng đang được xử lý
     - ℹ️ Đơn hàng đang giao

5. **Test các chức năng:**
   - Click "Xem đơn hàng #DH99999999" → Chuyển đến trang chi tiết đơn hàng
   - Click icon ✓ → Đánh dấu đã đọc (badge giảm xuống)
   - Click "Đánh dấu tất cả" → Tất cả thông báo thành đã đọc
   - Click icon 🗑️ → Xóa thông báo

---

### Bước 4: Test Đặt Hàng Mới (Toàn Bộ Luồng)

#### 4.1. Customer đặt hàng

1. **Đăng nhập customer:** `aq@gmail.com`
2. **Vào trang sản phẩm:** http://localhost:3004/products
3. **Chọn sản phẩm** → Click "Thêm vào giỏ"
4. **Vào giỏ hàng** → Click "Thanh toán"
5. **Điền thông tin:**
   ```
   Họ tên: Nguyễn Văn A
   Số điện thoại: 0987654321
   Địa chỉ: 123 Test St, HCM
   Phương thức: COD
   ```
6. **Click "Đặt hàng"**
7. ✅ **Kiểm tra thông báo:**
   - Click icon chuông (🔔)
   - **Phải thấy:** "✅ Đặt hàng thành công"
   - Badge hiển thị `+1`

#### 4.2. Admin xử lý đơn hàng

1. **Đăng xuất customer**
2. **Đăng nhập admin:**
   ```
   Email: anhquy20348@gmail.com
   Password: 123456
   ```
3. **Vào trang admin:** http://localhost:3004/admin/orders
4. **Tìm đơn hàng vừa tạo** (status: PENDING)
5. **Click "Cập nhật trạng thái"** → Chọn **PROCESSING**
6. **Click "Lưu"**
7. ✅ **Thông báo được tạo cho customer**

#### 4.3. Customer kiểm tra thông báo

1. **Đăng xuất admin**
2. **Đăng nhập lại customer:** `aq@gmail.com`
3. **Click icon chuông (🔔)**
4. ✅ **Phải thấy:**
   - "✅ Đặt hàng thành công" (từ bước 4.1)
   - "ℹ️ Đơn hàng đang được xử lý" (MỚI!)
   - Badge hiển thị `2`

#### 4.4. Admin tiếp tục cập nhật

1. **Đăng nhập admin** lại
2. **Cập nhật đơn hàng:** PROCESSING → **SHIPPING**
3. **Đăng xuất admin**
4. **Đăng nhập customer:** `aq@gmail.com`
5. **Click chuông (🔔)**
6. ✅ **Phải thấy:**
   - "✅ Đặt hàng thành công"
   - "ℹ️ Đơn hàng đang được xử lý"
   - "ℹ️ Đơn hàng đang giao" (MỚI!)
   - Badge hiển thị `3`

#### 4.5. Admin hoàn thành đơn hàng

1. **Đăng nhập admin**
2. **Cập nhật đơn hàng:** SHIPPING → **COMPLETED**
3. **Đăng xuất admin**
4. **Đăng nhập customer:** `aq@gmail.com`
5. **Click chuông (🔔)**
6. ✅ **Phải thấy:**
   - "✅ Đặt hàng thành công"
   - "ℹ️ Đơn hàng đang được xử lý"
   - "ℹ️ Đơn hàng đang giao"
   - "✅ Đơn hàng hoàn thành" (MỚI!)
   - Badge hiển thị `4`

---

### Bước 5: Test Hủy Đơn Hàng

1. **Đăng nhập customer:** `aq@gmail.com`
2. **Đặt đơn hàng mới** (theo bước 4.1)
3. **Vào "Đơn hàng của tôi":** http://localhost:3004/orders
4. **Chọn đơn hàng vừa tạo** (status: PENDING)
5. **Click "Hủy đơn hàng"**
6. **Xác nhận hủy**
7. ✅ **Kiểm tra thông báo:**
   - Click icon chuông (🔔)
   - **Phải thấy:** "❌ Đơn hàng đã hủy"

---

### Bước 6: Test Voucher

1. **Đăng nhập admin:** `anhquy20348@gmail.com`
2. **Vào trang vouchers:** http://localhost:3004/admin/vouchers
3. **Tạo voucher mới:**
   ```
   Mã: TESTCODE
   Loại: PERCENTAGE
   Giảm giá: 20%
   ```
4. **Click "Gửi thông báo"**
5. **Chọn customer:** `aq@gmail.com`
6. **Xác nhận gửi**
7. **Đăng xuất admin**
8. **Đăng nhập customer:** `aq@gmail.com`
9. ✅ **Kiểm tra thông báo:**
   - Click icon chuông (🔔)
   - **Phải thấy:** "🎁 Bạn nhận được mã giảm giá mới!"

---

## 🔍 Kiểm Tra Bằng SQL

### Xem tất cả notifications của customer:
```sql
SELECT
  n.title,
  n.message,
  n.type,
  n.createdAt,
  o.orderNumber
FROM notifications n
LEFT JOIN orders o ON n.orderId = o.id
WHERE n.userId = 'cmj8cygez00007kb4tj7a38zd'  -- ID của aq@gmail.com
ORDER BY n.createdAt DESC;
```

### Đếm notifications chưa đọc:
```sql
SELECT COUNT(*) as unread_count
FROM notifications
WHERE userId = 'cmj8cygez00007kb4tj7a38zd'
AND `read` = 0;
```

### Xem đơn hàng và thông báo liên quan:
```sql
SELECT
  o.orderNumber,
  o.status,
  COUNT(n.id) as notification_count
FROM orders o
LEFT JOIN notifications n ON o.id = n.orderId
WHERE o.userId = 'cmj8cygez00007kb4tj7a38zd'
GROUP BY o.id, o.orderNumber, o.status
ORDER BY o.createdAt DESC;
```

---

## 🐛 Troubleshooting

### Vấn đề 1: Không thấy icon chuông (🔔)

**Nguyên nhân:** Chưa đăng nhập hoặc component không render

**Giải pháp:**
1. Đăng nhập lại
2. Hard refresh: `Ctrl + Shift + R`
3. Kiểm tra console có lỗi không

---

### Vấn đề 2: Badge không hiển thị số

**Nguyên nhân:** Tất cả notifications đã đọc

**Giải pháp:**
1. Kiểm tra SQL:
   ```sql
   SELECT * FROM notifications
   WHERE userId = 'cmj8cygez00007kb4tj7a38zd'
   AND `read` = 0;
   ```
2. Nếu không có kết quả → Tất cả đã đọc → Đặt hàng mới để tạo notification mới

---

### Vấn đề 3: Dropdown rỗng (không có thông báo)

**Nguyên nhân:**
- API không hoạt động
- Customer chưa có đơn hàng nào

**Giải pháp:**
1. Kiểm tra console Network tab
2. Gọi API trực tiếp:
   ```
   GET http://localhost:3004/api/notifications
   ```
3. Đặt hàng mới để tạo notification

---

### Vấn đề 4: Thông báo không cập nhật real-time

**Nguyên nhân:** Auto-refresh 30 giây chưa chạy

**Giải pháp:**
1. Đợi 30 giây hoặc
2. Click lại icon chuông để refresh thủ công
3. Hoặc refresh trang: `F5`

---

### Vấn đề 5: Admin nhận thông báo thay vì customer

**Nguyên nhân:** Đơn hàng được đặt bởi admin

**Giải pháp:**
1. **Đăng nhập bằng customer** (không phải admin)
2. **Đặt hàng bằng customer account**
3. Thông báo sẽ gửi đến customer

**Kiểm tra userId của đơn hàng:**
```sql
SELECT
  o.orderNumber,
  u.email,
  u.role
FROM orders o
JOIN users u ON o.userId = u.id
ORDER BY o.createdAt DESC
LIMIT 5;
```

---

## ✅ Checklist Test Đầy Đủ

- [ ] Icon chuông (🔔) hiển thị khi đăng nhập customer
- [ ] Badge đỏ hiển thị số thông báo chưa đọc
- [ ] Dropdown mở ra khi click chuông
- [ ] Thông báo "✅ Đặt hàng thành công" xuất hiện sau khi đặt hàng
- [ ] Thông báo "ℹ️ Đang xử lý" xuất hiện khi admin cập nhật
- [ ] Thông báo "ℹ️ Đang giao" xuất hiện khi admin cập nhật SHIPPING
- [ ] Thông báo "✅ Hoàn thành" xuất hiện khi admin cập nhật COMPLETED
- [ ] Thông báo "❌ Đã hủy" xuất hiện khi customer hủy đơn
- [ ] Thông báo "🎁 Voucher" xuất hiện khi admin gửi voucher
- [ ] Click "Xem đơn hàng" chuyển đến trang chi tiết
- [ ] Đánh dấu đã đọc hoạt động (badge giảm)
- [ ] Đánh dấu tất cả đã đọc hoạt động
- [ ] Xóa thông báo hoạt động
- [ ] Auto-refresh mỗi 30 giây

---

## 📊 Dữ Liệu Test Có Sẵn

### Customer Test Account:
```
Email: aq@gmail.com
Password: 123456
Role: CUSTOMER
User ID: cmj8cygez00007kb4tj7a38zd
```

### Đơn hàng test:
```
Order Number: DH99999999
Status: SHIPPING
Có sẵn 3 notifications
```

### Admin Account:
```
Email: anhquy20348@gmail.com
Password: 123456
Role: ADMIN
```

---

## 🎯 Kết Luận

Hệ thống thông báo **hoạt động hoàn hảo**!

**Các thông báo customer nhận được:**
1. ✅ Đặt hàng thành công (ngay sau khi đặt hàng)
2. ℹ️ Đơn hàng đang xử lý (admin cập nhật)
3. ℹ️ Đơn hàng đang giao (admin cập nhật)
4. ✅ Đơn hàng hoàn thành (admin cập nhật)
5. ❌ Đơn hàng đã hủy (customer hủy)
6. 🎁 Nhận voucher (admin gửi)

**Tất cả đều hiển thị trong:**
- Icon chuông (🔔) trên header
- Badge đếm số chưa đọc
- Dropdown notifications
- Trang /notifications (xem tất cả)

Chúc test thành công! 🎉
