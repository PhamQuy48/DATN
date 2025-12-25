# 🔐 HƯỚNG DẪN CÀI ĐẶT GOOGLE OAUTH CHO SHOP QM

## 📋 Mục lục
1. [Tạo Google Cloud Project](#bước-1-tạo-google-cloud-project)
2. [Kích hoạt API](#bước-2-kích-hoạt-google-api)
3. [Cấu hình OAuth Consent Screen](#bước-3-cấu-hình-oauth-consent-screen)
4. [Tạo OAuth Credentials](#bước-4-tạo-oauth-credentials)
5. [Cập nhật .env](#bước-5-cập-nhật-env)
6. [Kiểm tra](#bước-6-kiểm-tra)

---

## Bước 1: Tạo Google Cloud Project

### 1.1. Truy cập Google Cloud Console
- Mở trình duyệt và vào: **https://console.cloud.google.com/**
- Đăng nhập bằng tài khoản Google của bạn

### 1.2. Tạo Project mới
1. Click vào dropdown **Select a project** ở góc trên bên trái
2. Click nút **NEW PROJECT**
3. Điền thông tin:
   - **Project name**: `SHOP-QM-Ecommerce`
   - **Location**: Để mặc định
4. Click **CREATE**
5. Đợi 10-20 giây để project được tạo
6. Click **SELECT PROJECT** để chọn project vừa tạo

---

## Bước 2: Kích hoạt Google API

### 2.1. Vào Library
1. Click menu ☰ (3 gạch ngang) ở góc trên bên trái
2. Chọn **APIs & Services** → **Library**

### 2.2. Enable Google+ API
1. Trong ô tìm kiếm, gõ: `Google+ API`
2. Click vào **Google+ API** (hoặc **People API** nếu không thấy)
3. Click nút **ENABLE**
4. Đợi API được kích hoạt (5-10 giây)

---

## Bước 3: Cấu hình OAuth Consent Screen

### 3.1. Mở OAuth consent screen
1. Click menu ☰ → **APIs & Services** → **OAuth consent screen**

### 3.2. Chọn User Type
1. Chọn **External** (để cho phép bất kỳ ai đăng nhập)
2. Click **CREATE**

### 3.3. OAuth consent screen - Tab 1: App information
Điền các thông tin sau:

**App information:**
- **App name**: `SHOP QM`
- **User support email**: Chọn email của bạn

**App domain (Optional):**
- Có thể bỏ qua phần này

**Authorized domains:**
- Có thể bỏ qua (chỉ cần khi deploy production)

**Developer contact information:**
- **Email addresses**: Nhập email của bạn

Click **SAVE AND CONTINUE**

### 3.4. OAuth consent screen - Tab 2: Scopes
1. Click **ADD OR REMOVE SCOPES**
2. Tìm và check vào 3 scopes sau:
   - ✅ `.../auth/userinfo.email` - See your primary Google Account email address
   - ✅ `.../auth/userinfo.profile` - See your personal info
   - ✅ `openid` - Associate you with your personal info on Google
3. Click **UPDATE**
4. Click **SAVE AND CONTINUE**

### 3.5. OAuth consent screen - Tab 3: Test users
1. Click **+ ADD USERS**
2. Nhập email của bạn (email dùng để test đăng nhập)
3. Click **ADD**
4. Click **SAVE AND CONTINUE**

### 3.6. OAuth consent screen - Tab 4: Summary
1. Xem lại thông tin
2. Click **BACK TO DASHBOARD**

---

## Bước 4: Tạo OAuth Credentials

### 4.1. Mở Credentials
1. Click menu ☰ → **APIs & Services** → **Credentials**

### 4.2. Create OAuth Client ID
1. Click **+ CREATE CREDENTIALS** ở trên cùng
2. Chọn **OAuth client ID**

### 4.3. Điền thông tin
**Application type:**
- Chọn **Web application**

**Name:**
- Nhập: `SHOP QM Web Client`

**Authorized JavaScript origins:**
- Click **+ ADD URI**
- Nhập: `http://localhost:3004`

**Authorized redirect URIs:**
- Click **+ ADD URI**
- Nhập: `http://localhost:3004/api/auth/callback/google`

⚠️ **CHÚ Ý**: URI phải chính xác 100%, không có dấu `/` thừa ở cuối!

### 4.4. Create
1. Click **CREATE**
2. Popup xuất hiện với **Client ID** và **Client Secret**
3. **QUAN TRỌNG**: Copy 2 thông tin này:
   - **Your Client ID**: Dạng `123456789-abc...xyz.apps.googleusercontent.com`
   - **Your Client Secret**: Dạng `GOCSPX-abc...xyz`

---

## Bước 5: Cập nhật .env

### 5.1. Mở file .env
Mở file `.env` trong thư mục `tech-ecommerce-ai`

### 5.2. Paste credentials
Tìm dòng:
```env
GOOGLE_CLIENT_ID="your-google-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
```

Thay thế bằng:
```env
GOOGLE_CLIENT_ID="paste-client-id-vừa-copy"
GOOGLE_CLIENT_SECRET="paste-client-secret-vừa-copy"
```

### 5.3. Lưu file
- Bấm **Ctrl + S** để lưu

---

## Bước 6: Kiểm tra

### 6.1. Restart Server
```bash
# Trong terminal, bấm Ctrl + C để dừng server
# Sau đó chạy lại:
cd tech-ecommerce-ai
npm run dev
```

### 6.2. Test đăng nhập
1. Mở trình duyệt: `http://localhost:3004/login`
2. Click nút **"Đăng nhập với Google"**
3. Chọn tài khoản Google
4. Nếu thành công → Chuyển đến trang sản phẩm
5. Nếu lỗi → Xem phần Troubleshooting bên dưới

---

## ⚠️ Troubleshooting - Xử lý lỗi

### Lỗi 1: "Access blocked: Authorization Error (Error 401: invalid_client)"

**Nguyên nhân:**
- Client ID hoặc Client Secret sai
- Redirect URI không khớp

**Cách fix:**
1. Kiểm tra lại Client ID và Secret trong file `.env`
2. Kiểm tra Redirect URI: Phải là `http://localhost:3004/api/auth/callback/google`
3. Restart server

### Lỗi 2: "Access blocked: This app's request is invalid"

**Nguyên nhân:**
- OAuth consent screen chưa hoàn tất
- Scopes chưa được thêm

**Cách fix:**
1. Vào Google Cloud Console
2. **APIs & Services** → **OAuth consent screen**
3. Kiểm tra status: Phải là **Testing** hoặc **Published**
4. Kiểm tra Scopes đã thêm đủ 3 scopes

### Lỗi 3: "Access blocked: Sign in with Google temporarily disabled for this app"

**Nguyên nhân:**
- Email của bạn chưa được thêm vào Test users (khi app ở chế độ Testing)

**Cách fix:**
1. Vào **OAuth consent screen**
2. Scroll xuống **Test users**
3. Click **+ ADD USERS**
4. Thêm email của bạn
5. Save

### Lỗi 4: Redirect về login page sau khi chọn tài khoản Google

**Nguyên nhân:**
- NextAuth configuration có vấn đề
- Database không lưu được user

**Cách fix:**
1. Check database đang chạy: `mysql -u root -p`
2. Check file `lib/auth.ts` có Google provider
3. Check console log để xem lỗi chi tiết

---

## 📝 Checklist hoàn thành

Đánh dấu ✅ khi hoàn thành mỗi bước:

- [ ] Tạo Google Cloud Project
- [ ] Enable Google+ API / People API
- [ ] Cấu hình OAuth Consent Screen (4 tabs)
- [ ] Thêm Test users (email của bạn)
- [ ] Tạo OAuth Credentials
- [ ] Copy Client ID và Client Secret
- [ ] Cập nhật file .env
- [ ] Restart server
- [ ] Test đăng nhập Google thành công

---

## 🚀 Khi Deploy Production

Khi deploy lên server thật (VD: Vercel, Railway, etc.), cần:

1. **Thêm domain vào Authorized JavaScript origins:**
   ```
   https://your-domain.com
   ```

2. **Thêm domain vào Authorized redirect URIs:**
   ```
   https://your-domain.com/api/auth/callback/google
   ```

3. **Cập nhật .env trên server** với:
   ```env
   NEXTAUTH_URL="https://your-domain.com"
   ```

4. **Publish OAuth consent screen** (Optional):
   - Vào OAuth consent screen
   - Click **PUBLISH APP**
   - Điền form verification (nếu cần)

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Check console log trong terminal
2. Check browser DevTools → Console tab
3. Đọc kỹ error message
4. Google search error message + "NextAuth Google OAuth"

---

**Chúc bạn cấu hình thành công! 🎉**
