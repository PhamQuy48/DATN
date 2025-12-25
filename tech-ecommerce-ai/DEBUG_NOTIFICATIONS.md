# 🐛 Debug Thông Báo Không Hiển Thị

## Vấn đề: "Không có thông báo nào"

### Nguyên nhân phổ biến:

1. **Đăng nhập sai tài khoản** (Admin thay vì Customer)
2. Session không đúng
3. API không fetch được
4. Browser cache

---

## ✅ Giải pháp từng bước:

### Bước 1: Kiểm tra tài khoản đang đăng nhập

**Quan trọng:** Mở Console (F12) → Tab Console → Gõ:

```javascript
// Kiểm tra session hiện tại
fetch('/api/auth/session')
  .then(res => res.json())
  .then(data => console.log('Current session:', data))
```

**Kết quả mong đợi:**
```json
{
  "user": {
    "email": "aq@gmail.com",  ← Phải là email này!
    "role": "CUSTOMER"
  }
}
```

**Nếu thấy:**
- Email khác (VD: anhquy20348@gmail.com) → **Đăng nhập sai account!**
- Role: "ADMIN" → **Đây là admin, không phải customer!**

**Giải pháp:**
1. Đăng xuất
2. Đăng nhập lại với: `aq@gmail.com` / `123456`

---

### Bước 2: Test API notifications trực tiếp

**Mở Console (F12) → Tab Console → Gõ:**

```javascript
// Test API notifications
fetch('/api/notifications?limit=10')
  .then(res => res.json())
  .then(data => console.log('Notifications:', data))
```

**Kết quả mong đợi:**
```json
{
  "notifications": [
    {
      "id": "...",
      "title": "Đơn hàng đang giao",
      "message": "...",
      "type": "INFO",
      "read": false
    },
    // ... 2 notifications nữa
  ],
  "unreadCount": 3
}
```

**Nếu thấy:**
- `notifications: []` → Không có notifications cho user này
- `error: "Unauthorized"` → Chưa đăng nhập
- `unreadCount: 0` → Tất cả đã đọc

---

### Bước 3: Hard Refresh Browser

1. **Xóa cache:**
   - Chrome: `Ctrl + Shift + R`
   - Firefox: `Ctrl + Shift + R`
   - Edge: `Ctrl + F5`

2. **Hoặc xóa cookies:**
   - F12 → Application → Cookies → Xóa tất cả
   - Đăng nhập lại

---

### Bước 4: Kiểm tra Network Request

1. Mở **DevTools** (F12)
2. Tab **Network**
3. Click icon chuông (🔔)
4. Tìm request `/api/notifications`
5. Click vào request đó
6. Tab **Response** → Xem data trả về

**Kết quả mong đợi:**
```json
{
  "notifications": [...],
  "unreadCount": 3
}
```

**Nếu thấy:**
- Status: 401 → Không đăng nhập
- Status: 500 → Lỗi server
- `notifications: []` → User không có notifications

---

### Bước 5: Đảm bảo đăng nhập đúng customer

**QUAN TRỌNG:** Phải đăng nhập với tài khoản **CUSTOMER**!

✅ **Đúng:**
```
Email: aq@gmail.com
Password: 123456
Role: CUSTOMER
```

❌ **Sai:**
```
Email: anhquy20348@gmail.com  ← ĐÂY LÀ ADMIN!
Password: 123456
Role: ADMIN
```

**Cách kiểm tra:**
- Nhìn vào header → Thấy tên "aq" hoặc email "aq@gmail.com"
- Console: `fetch('/api/auth/session').then(r=>r.json()).then(console.log)`

---

### Bước 6: Restart Server

Nếu vẫn không được:

```bash
# Stop server (Ctrl+C)

# Clear .next cache
cd tech-ecommerce-ai
rm -rf .next
# Hoặc trên Windows:
# rmdir /s .next

# Restart
npm run dev
```

---

### Bước 7: Kiểm tra Database trực tiếp

```bash
"C:\xampp\mysql\bin\mysql.exe" -u root -e "USE shopqm_db; SELECT u.email, COUNT(n.id) as notif_count FROM users u LEFT JOIN notifications n ON u.id = n.userId WHERE u.email = 'aq@gmail.com' GROUP BY u.id, u.email;"
```

**Kết quả mong đợi:**
```
email           | notif_count
aq@gmail.com    | 3
```

**Nếu thấy:**
- `notif_count: 0` → Không có notifications trong DB
- User không tồn tại → Email sai

---

## 🔧 Quick Fix Script

Tạo file `test-notifications.html` và mở trong browser:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Notifications</title>
</head>
<body>
  <h1>Test Notifications API</h1>
  <button onclick="testSession()">1. Test Session</button>
  <button onclick="testNotifications()">2. Test Notifications</button>
  <button onclick="clearAndReload()">3. Clear Cache & Reload</button>

  <pre id="result"></pre>

  <script>
    const resultEl = document.getElementById('result');

    async function testSession() {
      try {
        const res = await fetch('http://localhost:3004/api/auth/session');
        const data = await res.json();
        resultEl.textContent = JSON.stringify(data, null, 2);

        if (data.user?.email === 'aq@gmail.com') {
          alert('✅ Đăng nhập đúng customer!');
        } else {
          alert('❌ SAI TÀI KHOẢN! Phải đăng nhập: aq@gmail.com');
        }
      } catch (error) {
        resultEl.textContent = 'Error: ' + error.message;
      }
    }

    async function testNotifications() {
      try {
        const res = await fetch('http://localhost:3004/api/notifications?limit=10');
        const data = await res.json();
        resultEl.textContent = JSON.stringify(data, null, 2);

        if (data.notifications && data.notifications.length > 0) {
          alert(`✅ Có ${data.notifications.length} notifications!`);
        } else {
          alert('❌ Không có notifications! Kiểm tra lại session.');
        }
      } catch (error) {
        resultEl.textContent = 'Error: ' + error.message;
      }
    }

    function clearAndReload() {
      // Clear localStorage
      localStorage.clear();
      // Reload page
      window.location.reload(true);
    }
  </script>
</body>
</html>
```

---

## ✅ Checklist Debug

- [ ] Kiểm tra đang đăng nhập với `aq@gmail.com` (không phải admin)
- [ ] F12 → Console → Test `/api/auth/session`
- [ ] F12 → Console → Test `/api/notifications`
- [ ] F12 → Network → Xem request `/api/notifications`
- [ ] Hard refresh: `Ctrl + Shift + R`
- [ ] Xóa cookies và đăng nhập lại
- [ ] Restart server
- [ ] Kiểm tra database có notifications không

---

## 💡 Lời Khuyên

**99% trường hợp lỗi này do:**
1. **Đăng nhập sai tài khoản** (admin thay vì customer)
2. **Browser cache** cũ

**Giải pháp nhanh nhất:**
1. Đăng xuất hoàn toàn
2. Hard refresh (`Ctrl + Shift + R`)
3. Đăng nhập lại với `aq@gmail.com` / `123456`
4. Click chuông (🔔)

---

## 🎯 Nếu vẫn không được

Chụp màn hình và gửi:
1. F12 → Console tab (có logs gì?)
2. F12 → Network tab → Request `/api/notifications` (Response là gì?)
3. F12 → Application → Cookies (có cookie `next-auth.session-token` không?)
4. Kết quả câu lệnh: `fetch('/api/auth/session').then(r=>r.json()).then(console.log)`
