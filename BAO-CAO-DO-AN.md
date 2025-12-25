                                # BÁO CÁO ĐỒ ÁN TỐT NGHIỆP
# HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ SHOP QM

---

## MỤC LỤC

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
3. [Các Actor trong hệ thống](#3-các-actor-trong-hệ-thống)
4. [Danh sách chức năng](#4-danh-sách-chức-năng)
5. [Use Case Diagram](#5-use-case-diagram)
6. [Activity Diagram](#6-activity-diagram)
7. [Database Design](#7-database-design)
8. [Sequence Diagrams](#8-sequence-diagrams)
9. [Component Architecture](#9-component-architecture)
10. [Tính năng nổi bật](#10-tính-năng-nổi-bật)

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1. Giới thiệu

**SHOP QM E-Commerce Platform** là một hệ thống thương mại điện tử toàn diện được xây dựng với các công nghệ hiện đại. Hệ thống cung cấp trải nghiệm mua sắm trực tuyến cho khách hàng, công cụ quản lý mạnh mẽ cho admin và nhân viên.

### 1.2. Mục tiêu

- Xây dựng nền tảng thương mại điện tử đầy đủ chức năng
- Tích hợp AI để hỗ trợ khách hàng và tìm kiếm sản phẩm thông minh
- Quản lý đơn hàng, sản phẩm, khách hàng hiệu quả
- Hệ thống voucher và khuyến mãi linh hoạt
- Thông báo real-time cho admin và khách hàng
- Bảo mật và xác thực người dùng

### 1.3. Đối tượng sử dụng

- **Khách hàng**: Người mua sắm trực tuyến
- **Admin**: Quản trị viên hệ thống
- **Staff**: Nhân viên bán hàng/hỗ trợ

---

## 2. CÔNG NGHỆ SỬ DỤNG

### 2.1. Frontend

- **Next.js 15** - React Framework với App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Notification system
- **date-fns** - Date formatting library

### 2.2. Backend

- **Next.js API Routes** - Serverless API
- **Prisma ORM** - Database ORM
- **NextAuth.js** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service

### 2.3. Database

- **MySQL** - Relational database

### 2.4. AI Integration

- **Hugging Face API** - AI models
- **Visual Search** - Image-based product search
- **AI Chat Assistant** - Customer support chatbot

### 2.5. Authentication

- **NextAuth.js** - Session management
- **Google OAuth** - Social login
- **Credentials Provider** - Email/password login

### 2.6. Email Service

- **Nodemailer** - Email sending
- **Gmail SMTP** - Email provider

---

## 3. CÁC ACTOR TRONG HỆ THỐNG

```mermaid
graph TB
    Customer[👤 Khách hàng<br/>Customer]
    Admin[👨‍💼 Quản trị viên<br/>Admin]
    Staff[👔 Nhân viên<br/>Staff]
    Guest[👥 Khách vãng lai<br/>Guest]

    System[🏪 Hệ thống SHOP QM]

    Customer --> System
    Admin --> System
    Staff --> System
    Guest --> System

    style Customer fill:#e1f5ff
    style Admin fill:#ffe1e1
    style Staff fill:#fff4e1
    style Guest fill:#f0f0f0
    style System fill:#e1ffe1
```

### 3.1. Khách vãng lai (Guest)
- Xem danh sách sản phẩm
- Tìm kiếm sản phẩm
- Xem chi tiết sản phẩm
- Đăng ký tài khoản
- Đăng nhập

### 3.2. Khách hàng (Customer)
- Tất cả quyền của Guest
- Quản lý thông tin cá nhân
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng và thanh toán
- Theo dõi đơn hàng
- Hủy đơn hàng
- Đánh giá sản phẩm
- Sử dụng voucher
- Nhận thông báo
- Sử dụng AI Assistant
- Tìm kiếm bằng hình ảnh

### 3.3. Nhân viên (Staff)
- Xem danh sách đơn hàng
- Cập nhật trạng thái đơn hàng
- Xem thông tin khách hàng
- Xem thống kê cơ bản

### 3.4. Quản trị viên (Admin)
- Tất cả quyền của Staff
- Quản lý sản phẩm (CRUD)
- Quản lý danh mục
- Quản lý người dùng
- Quản lý đơn hàng (tất cả trạng thái)
- Quản lý voucher
- Xem thống kê chi tiết
- Gửi email khuyến mãi
- Nhận thông báo đơn hàng mới
- Quản lý nhân viên

---

## 4. DANH SÁCH CHỨC NĂNG

### 4.1. Module Xác thực & Phân quyền

#### 4.1.1. Đăng ký
- ✅ Đăng ký bằng email/password
- ✅ Đăng ký bằng Google OAuth
- ✅ Validate thông tin đăng ký
- ✅ Mã hóa mật khẩu (bcrypt)
- ✅ Tự động đăng nhập sau khi đăng ký

#### 4.1.2. Đăng nhập
- ✅ Đăng nhập bằng email/password
- ✅ Đăng nhập bằng Google OAuth
- ✅ Đăng nhập riêng cho Admin
- ✅ Đăng nhập riêng cho Staff
- ✅ Remember me session
- ✅ Auto-redirect theo role

#### 4.1.3. Quên mật khẩu
- ✅ Gửi mã OTP (6 số) qua email
- ✅ Xác thực mã OTP
- ✅ Đặt lại mật khẩu
- ✅ Mã OTP có thời hạn 15 phút
- ✅ Mã OTP chỉ sử dụng 1 lần
- ✅ Email template chuyên nghiệp

#### 4.1.4. Phân quyền
- ✅ Role-based access control (RBAC)
- ✅ 3 roles: CUSTOMER, STAFF, ADMIN
- ✅ Middleware bảo vệ routes
- ✅ API authorization checks

### 4.2. Module Sản phẩm

#### 4.2.1. Quản lý sản phẩm (Admin)
- ✅ Thêm sản phẩm mới
- ✅ Cập nhật thông tin sản phẩm
- ✅ Xóa sản phẩm
- ✅ Upload hình ảnh sản phẩm
- ✅ Quản lý kho (stock)
- ✅ Thiết lập giá bán và giá khuyến mãi
- ✅ Đánh dấu sản phẩm nổi bật/hot
- ✅ Quản lý thông số kỹ thuật (specs)
- ✅ SKU duy nhất cho mỗi sản phẩm

#### 4.2.2. Danh sách sản phẩm (Public)
- ✅ Hiển thị grid view sản phẩm
- ✅ Phân trang
- ✅ Lọc theo danh mục
- ✅ Lọc theo giá
- ✅ Lọc theo thương hiệu
- ✅ Sắp xếp (giá, tên, mới nhất)
- ✅ Tìm kiếm sản phẩm
- ✅ Tìm kiếm bằng hình ảnh (AI)
- ✅ Hiển thị badge (Hot, Sale)

#### 4.2.3. Chi tiết sản phẩm
- ✅ Thông tin chi tiết sản phẩm
- ✅ Gallery hình ảnh
- ✅ Thông số kỹ thuật
- ✅ Đánh giá và nhận xét
- ✅ Sản phẩm liên quan
- ✅ Thêm vào giỏ hàng
- ✅ Số lượng còn trong kho
- ✅ Tính toán giá khuyến mãi

### 4.3. Module Giỏ hàng & Checkout

#### 4.3.1. Giỏ hàng
- ✅ Thêm sản phẩm vào giỏ
- ✅ Cập nhật số lượng
- ✅ Xóa sản phẩm khỏi giỏ
- ✅ Tính tổng tiền tự động
- ✅ Lưu giỏ hàng (localStorage)
- ✅ Hiển thị số lượng items trên icon
- ✅ Kiểm tra tồn kho

#### 4.3.2. Thanh toán
- ✅ Form thông tin giao hàng
- ✅ Nhập mã voucher
- ✅ Validate voucher
- ✅ Tính toán discount
- ✅ Tính phí vận chuyển
- ✅ Chọn phương thức thanh toán
- ✅ Ghi chú đơn hàng
- ✅ Xác nhận đơn hàng
- ✅ Tạo mã đơn hàng tự động
- ✅ Trừ tồn kho sau khi đặt hàng

#### 4.3.3. Trang thành công
- ✅ Hiển thị thông tin đơn hàng
- ✅ Số đơn hàng
- ✅ Tổng tiền
- ✅ Link theo dõi đơn hàng
- ✅ Tiếp tục mua sắm

### 4.4. Module Đơn hàng

#### 4.4.1. Quản lý đơn hàng (Customer)
- ✅ Xem danh sách đơn hàng
- ✅ Chi tiết đơn hàng
- ✅ Lọc theo trạng thái
- ✅ Hủy đơn hàng (nếu PENDING)
- ✅ Theo dõi trạng thái
- ✅ Timeline đơn hàng

#### 4.4.2. Quản lý đơn hàng (Admin/Staff)
- ✅ Xem tất cả đơn hàng
- ✅ Lọc theo trạng thái
- ✅ Tìm kiếm đơn hàng
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Xem chi tiết khách hàng
- ✅ In hóa đơn
- ✅ Thống kê đơn hàng

#### 4.4.3. Trạng thái đơn hàng
- ✅ PENDING - Chờ xử lý
- ✅ PROCESSING - Đang xử lý
- ✅ SHIPPING - Đang giao hàng
- ✅ COMPLETED - Hoàn thành
- ✅ CANCELLED - Đã hủy
- ✅ REFUNDING - Đang hoàn tiền

#### 4.4.4. Trạng thái thanh toán
- ✅ PENDING - Chờ thanh toán
- ✅ PAID - Đã thanh toán
- ✅ REFUNDED - Đã hoàn tiền
- ✅ FAILED - Thanh toán thất bại

### 4.5. Module Voucher

#### 4.5.1. Quản lý Voucher (Admin)
- ✅ Tạo voucher mới
- ✅ Cập nhật voucher
- ✅ Xóa voucher
- ✅ Kích hoạt/vô hiệu hóa
- ✅ Thiết lập thời hạn
- ✅ Giới hạn số lần sử dụng
- ✅ Giá trị đơn hàng tối thiểu
- ✅ Giảm giá tối đa

#### 4.5.2. Loại Voucher
- ✅ PERCENTAGE - Giảm theo phần trăm
- ✅ FIXED_AMOUNT - Giảm số tiền cố định

#### 4.5.3. Validate Voucher
- ✅ Kiểm tra mã voucher tồn tại
- ✅ Kiểm tra còn hiệu lực
- ✅ Kiểm tra số lần sử dụng
- ✅ Kiểm tra giá trị đơn hàng tối thiểu
- ✅ Tính toán giảm giá
- ✅ Cập nhật số lần đã sử dụng

### 4.6. Module Thông báo

#### 4.6.1. Thông báo cho Admin
- ✅ Nhận thông báo đơn hàng mới
- ✅ Đếm số thông báo chưa đọc
- ✅ Danh sách thông báo
- ✅ Đánh dấu đã đọc
- ✅ Xóa thông báo
- ✅ Auto-refresh mỗi 30 giây
- ✅ Link đến đơn hàng

#### 4.6.2. Thông báo cho Customer
- ✅ Nhận thông báo khi đơn hàng thay đổi trạng thái
- ✅ Đếm số thông báo chưa đọc
- ✅ Danh sách thông báo
- ✅ Đánh dấu đã đọc
- ✅ Xóa thông báo
- ✅ Auto-refresh mỗi 30 giây
- ✅ Link đến đơn hàng

#### 4.6.3. Loại thông báo
- ✅ INFO - Thông tin
- ✅ SUCCESS - Thành công
- ✅ WARNING - Cảnh báo
- ✅ ERROR - Lỗi
- ✅ ORDER - Đơn hàng

### 4.7. Module Đánh giá

#### 4.7.1. Viết đánh giá
- ✅ Đánh giá sao (1-5)
- ✅ Viết nhận xét
- ✅ Upload hình ảnh
- ✅ Chỉ đánh giá khi đã mua hàng
- ✅ Đánh dấu verified purchase

#### 4.7.2. Hiển thị đánh giá
- ✅ Danh sách đánh giá sản phẩm
- ✅ Thống kê rating
- ✅ Phân trang
- ✅ Hiển thị hình ảnh từ người dùng
- ✅ Ngày đánh giá
- ✅ Tên người đánh giá

### 4.8. Module AI Assistant

#### 4.8.1. Chat với AI
- ✅ Trò chuyện với AI assistant
- ✅ Tư vấn sản phẩm
- ✅ Trả lời câu hỏi
- ✅ Gợi ý sản phẩm
- ✅ Lịch sử chat
- ✅ UI chat đẹp mắt

#### 4.8.2. Visual Search
- ✅ Upload hình ảnh để tìm kiếm
- ✅ AI phân tích hình ảnh
- ✅ Tìm sản phẩm tương tự
- ✅ Hiển thị kết quả

### 4.9. Module Email

#### 4.9.1. Email khuyến mãi (Admin)
- ✅ Chọn sản phẩm khuyến mãi
- ✅ Thiết lập % giảm giá
- ✅ Thiết lập thời hạn
- ✅ Gửi đến tất cả khách hàng
- ✅ Email template đẹp
- ✅ Thống kê email đã gửi
- ✅ Tracking thành công/thất bại

#### 4.9.2. Email đặt lại mật khẩu
- ✅ Gửi mã OTP 6 số
- ✅ Email template chuyên nghiệp
- ✅ Link trực tiếp đến trang reset
- ✅ Cảnh báo bảo mật

### 4.10. Module Thống kê (Admin)

#### 4.10.1. Dashboard
- ✅ Tổng doanh thu
- ✅ Tổng đơn hàng
- ✅ Tổng khách hàng
- ✅ Tổng sản phẩm
- ✅ Biểu đồ doanh thu theo thời gian
- ✅ Đơn hàng cần xử lý
- ✅ Sản phẩm sắp hết hàng
- ✅ Top sản phẩm bán chạy

### 4.11. Module Quản lý User (Admin)

#### 4.11.1. Danh sách người dùng
- ✅ Xem tất cả users
- ✅ Lọc theo role
- ✅ Tìm kiếm user
- ✅ Cập nhật role
- ✅ Ban/unban user
- ✅ Xem lịch sử đơn hàng của user

### 4.12. Module Profile

#### 4.12.1. Thông tin cá nhân
- ✅ Xem thông tin profile
- ✅ Cập nhật tên
- ✅ Cập nhật email
- ✅ Cập nhật số điện thoại
- ✅ Cập nhật địa chỉ
- ✅ Đổi mật khẩu
- ✅ Upload avatar

### 4.13. Module Danh mục

#### 4.13.1. Quản lý danh mục (Admin)
- ✅ Thêm danh mục mới
- ✅ Cập nhật danh mục
- ✅ Xóa danh mục
- ✅ Upload hình ảnh danh mục
- ✅ Slug tự động

---

## 5. USE CASE DIAGRAM

### 5.1. Use Case tổng quan hệ thống

```mermaid
graph TB
    subgraph Actors
        Guest[👥 Khách vãng lai]
        Customer[👤 Khách hàng]
        Staff[👔 Nhân viên]
        Admin[👨‍💼 Admin]
    end

    subgraph "Hệ thống SHOP QM"
        subgraph "Module Sản phẩm"
            UC1[Xem sản phẩm]
            UC2[Tìm kiếm sản phẩm]
            UC3[Quản lý sản phẩm]
        end

        subgraph "Module Đơn hàng"
            UC4[Đặt hàng]
            UC5[Quản lý đơn hàng]
            UC6[Cập nhật trạng thái]
        end

        subgraph "Module User"
            UC7[Đăng ký/Đăng nhập]
            UC8[Quản lý profile]
            UC9[Quản lý users]
        end

        subgraph "Module AI"
            UC10[Chat AI]
            UC11[Visual Search]
        end

        subgraph "Module Voucher"
            UC12[Sử dụng voucher]
            UC13[Quản lý voucher]
        end

        subgraph "Module Thông báo"
            UC14[Nhận thông báo]
            UC15[Quản lý thông báo]
        end
    end

    Guest --> UC1
    Guest --> UC2
    Guest --> UC7

    Customer --> UC1
    Customer --> UC2
    Customer --> UC4
    Customer --> UC5
    Customer --> UC8
    Customer --> UC10
    Customer --> UC11
    Customer --> UC12
    Customer --> UC14

    Staff --> UC1
    Staff --> UC5
    Staff --> UC6

    Admin --> UC1
    Admin --> UC3
    Admin --> UC5
    Admin --> UC6
    Admin --> UC9
    Admin --> UC13
    Admin --> UC14
    Admin --> UC15

    style Guest fill:#f0f0f0
    style Customer fill:#e1f5ff
    style Staff fill:#fff4e1
    style Admin fill:#ffe1e1
```

### 5.2. Use Case chi tiết - Khách hàng (Customer)

```mermaid
graph TB
    Customer[👤 Khách hàng]

    subgraph "Authentication"
        UC1[Đăng ký tài khoản]
        UC2[Đăng nhập]
        UC3[Đăng nhập Google]
        UC4[Quên mật khẩu]
        UC5[Đổi mật khẩu]
    end

    subgraph "Quản lý Profile"
        UC6[Xem profile]
        UC7[Cập nhật thông tin]
        UC8[Upload avatar]
    end

    subgraph "Mua sắm"
        UC9[Xem danh sách sản phẩm]
        UC10[Tìm kiếm sản phẩm]
        UC11[Lọc sản phẩm]
        UC12[Xem chi tiết sản phẩm]
        UC13[Tìm kiếm bằng hình ảnh]
        UC14[Thêm vào giỏ hàng]
        UC15[Xem giỏ hàng]
        UC16[Thanh toán]
    end

    subgraph "Voucher"
        UC17[Áp dụng voucher]
        UC18[Validate voucher]
    end

    subgraph "Đơn hàng"
        UC19[Xem đơn hàng]
        UC20[Chi tiết đơn hàng]
        UC21[Hủy đơn hàng]
        UC22[Theo dõi đơn hàng]
    end

    subgraph "Đánh giá"
        UC23[Viết đánh giá]
        UC24[Upload ảnh review]
    end

    subgraph "AI Features"
        UC25[Chat với AI]
        UC26[Nhận gợi ý sản phẩm]
    end

    subgraph "Thông báo"
        UC27[Xem thông báo]
        UC28[Đánh dấu đã đọc]
    end

    Customer --> UC1
    Customer --> UC2
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7
    Customer --> UC8
    Customer --> UC9
    Customer --> UC10
    Customer --> UC12
    Customer --> UC13
    Customer --> UC14
    Customer --> UC15
    Customer --> UC16
    Customer --> UC17
    Customer --> UC19
    Customer --> UC20
    Customer --> UC21
    Customer --> UC22
    Customer --> UC23
    Customer --> UC25
    Customer --> UC27

    UC2 -.extends.-> UC3
    UC10 -.includes.-> UC11
    UC16 -.includes.-> UC17
    UC17 -.includes.-> UC18
    UC16 -.includes.-> UC15
    UC23 -.includes.-> UC24
    UC25 -.includes.-> UC26
    UC27 -.includes.-> UC28

    style Customer fill:#e1f5ff
```

### 5.3. Use Case chi tiết - Admin

```mermaid
graph TB
    Admin[👨‍💼 Admin]

    subgraph "Quản lý sản phẩm"
        UC1[Xem danh sách sản phẩm]
        UC2[Thêm sản phẩm]
        UC3[Sửa sản phẩm]
        UC4[Xóa sản phẩm]
        UC5[Upload hình ảnh]
        UC6[Quản lý tồn kho]
        UC7[Thiết lập giá]
    end

    subgraph "Quản lý danh mục"
        UC8[Thêm danh mục]
        UC9[Sửa danh mục]
        UC10[Xóa danh mục]
    end

    subgraph "Quản lý đơn hàng"
        UC11[Xem tất cả đơn hàng]
        UC12[Lọc đơn hàng]
        UC13[Tìm kiếm đơn hàng]
        UC14[Xem chi tiết đơn hàng]
        UC15[Cập nhật trạng thái]
        UC16[Gửi thông báo cho khách]
    end

    subgraph "Quản lý người dùng"
        UC17[Xem danh sách users]
        UC18[Tìm kiếm user]
        UC19[Cập nhật role]
        UC20[Ban user]
        UC21[Unban user]
    end

    subgraph "Quản lý voucher"
        UC22[Tạo voucher]
        UC23[Sửa voucher]
        UC24[Xóa voucher]
        UC25[Kích hoạt voucher]
        UC26[Vô hiệu hóa voucher]
    end

    subgraph "Marketing"
        UC27[Gửi email khuyến mãi]
        UC28[Chọn sản phẩm]
        UC29[Thiết lập discount]
        UC30[Xem thống kê email]
    end

    subgraph "Thống kê"
        UC31[Xem dashboard]
        UC32[Xem doanh thu]
        UC33[Xem biểu đồ]
        UC34[Top sản phẩm]
    end

    subgraph "Thông báo"
        UC35[Nhận thông báo đơn mới]
        UC36[Xem danh sách thông báo]
        UC37[Đánh dấu đã đọc]
        UC38[Xóa thông báo]
    end

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC14
    Admin --> UC15
    Admin --> UC17
    Admin --> UC18
    Admin --> UC19
    Admin --> UC20
    Admin --> UC21
    Admin --> UC22
    Admin --> UC23
    Admin --> UC24
    Admin --> UC25
    Admin --> UC26
    Admin --> UC27
    Admin --> UC31
    Admin --> UC35
    Admin --> UC36

    UC2 -.includes.-> UC5
    UC2 -.includes.-> UC7
    UC3 -.includes.-> UC5
    UC3 -.includes.-> UC6
    UC11 -.includes.-> UC12
    UC11 -.includes.-> UC13
    UC15 -.includes.-> UC16
    UC17 -.includes.-> UC18
    UC27 -.includes.-> UC28
    UC27 -.includes.-> UC29
    UC27 -.includes.-> UC30
    UC31 -.includes.-> UC32
    UC31 -.includes.-> UC33
    UC31 -.includes.-> UC34
    UC36 -.includes.-> UC37
    UC36 -.includes.-> UC38

    style Admin fill:#ffe1e1
```

### 5.4. Use Case chi tiết - Staff

```mermaid
graph TB
    Staff[👔 Nhân viên]

    subgraph "Xác thực"
        UC1[Đăng nhập Staff]
        UC2[Đăng xuất]
    end

    subgraph "Xem sản phẩm"
        UC3[Xem danh sách sản phẩm]
        UC4[Tìm kiếm sản phẩm]
        UC5[Xem chi tiết]
    end

    subgraph "Quản lý đơn hàng"
        UC6[Xem danh sách đơn hàng]
        UC7[Lọc đơn hàng]
        UC8[Xem chi tiết đơn hàng]
        UC9[Cập nhật trạng thái]
        UC10[Gửi thông báo]
    end

    subgraph "Khách hàng"
        UC11[Xem thông tin khách hàng]
        UC12[Xem lịch sử đơn hàng]
    end

    Staff --> UC1
    Staff --> UC2
    Staff --> UC3
    Staff --> UC4
    Staff --> UC5
    Staff --> UC6
    Staff --> UC8
    Staff --> UC9
    Staff --> UC11
    Staff --> UC12

    UC6 -.includes.-> UC7
    UC9 -.includes.-> UC10

    style Staff fill:#fff4e1
```

---

## 6. ACTIVITY DIAGRAM

### 6.1. Activity Diagram - Quy trình mua hàng

```mermaid
graph TD
    Start([Bắt đầu]) --> Browse[Khách hàng duyệt sản phẩm]
    Browse --> Search{Tìm kiếm?}

    Search -->|Có| SearchType{Loại tìm kiếm}
    SearchType -->|Text| TextSearch[Tìm kiếm văn bản]
    SearchType -->|Image| ImageSearch[Upload ảnh tìm kiếm AI]

    Search -->|Không| Filter{Lọc/Sắp xếp?}

    TextSearch --> ShowResults[Hiển thị kết quả]
    ImageSearch --> AIAnalyze[AI phân tích ảnh]
    AIAnalyze --> ShowResults
    Filter -->|Có| ApplyFilter[Áp dụng filter]
    Filter -->|Không| ShowResults
    ApplyFilter --> ShowResults

    ShowResults --> SelectProduct[Chọn sản phẩm]
    SelectProduct --> ViewDetail[Xem chi tiết sản phẩm]
    ViewDetail --> CheckStock{Còn hàng?}

    CheckStock -->|Không| OutOfStock[Thông báo hết hàng]
    OutOfStock --> Browse

    CheckStock -->|Có| AddToCart{Thêm vào giỏ?}
    AddToCart -->|Không| ContinueBrowse{Tiếp tục mua?}
    ContinueBrowse -->|Có| Browse
    ContinueBrowse -->|Không| End([Kết thúc])

    AddToCart -->|Có| CartAdded[Thêm vào giỏ hàng]
    CartAdded --> MoreProducts{Mua thêm?}
    MoreProducts -->|Có| Browse

    MoreProducts -->|Không| CheckLogin{Đã đăng nhập?}
    CheckLogin -->|Không| LoginRegister{Đăng nhập/Đăng ký}
    LoginRegister --> Login[Đăng nhập]
    Login --> ViewCart[Xem giỏ hàng]

    CheckLogin -->|Có| ViewCart
    ViewCart --> UpdateCart{Cập nhật giỏ?}
    UpdateCart -->|Có| Modify[Sửa số lượng/Xóa]
    Modify --> ViewCart

    UpdateCart -->|Không| Checkout[Chuyển đến thanh toán]
    Checkout --> FillInfo[Điền thông tin giao hàng]
    FillInfo --> VoucherCheck{Có voucher?}

    VoucherCheck -->|Có| EnterVoucher[Nhập mã voucher]
    EnterVoucher --> ValidateVoucher{Validate voucher}
    ValidateVoucher -->|Không hợp lệ| VoucherError[Thông báo lỗi]
    VoucherError --> VoucherCheck
    ValidateVoucher -->|Hợp lệ| ApplyDiscount[Áp dụng giảm giá]
    ApplyDiscount --> CalculateTotal

    VoucherCheck -->|Không| CalculateTotal[Tính tổng tiền]
    CalculateTotal --> SelectPayment[Chọn phương thức thanh toán]
    SelectPayment --> ConfirmOrder[Xác nhận đặt hàng]

    ConfirmOrder --> CreateOrder[Tạo đơn hàng]
    CreateOrder --> UpdateStock[Cập nhật tồn kho]
    UpdateStock --> UpdateVoucher{Có voucher?}

    UpdateVoucher -->|Có| IncrementUsage[Tăng usedCount]
    IncrementUsage --> NotifyAdmin
    UpdateVoucher -->|Không| NotifyAdmin[Gửi thông báo cho Admin]

    NotifyAdmin --> SendEmail[Gửi email xác nhận]
    SendEmail --> ShowSuccess[Hiển thị thành công]
    ShowSuccess --> End

    style Start fill:#e1ffe1
    style End fill:#ffe1e1
    style CreateOrder fill:#fff4e1
    style AIAnalyze fill:#e1f5ff
```

### 6.2. Activity Diagram - Quy trình quản lý đơn hàng (Admin/Staff)

```mermaid
graph TD
    Start([Bắt đầu]) --> Notification[Nhận thông báo đơn mới]
    Notification --> OpenDashboard[Mở trang quản lý đơn hàng]
    OpenDashboard --> Filter{Lọc đơn hàng?}

    Filter -->|Có| ApplyFilter[Lọc theo trạng thái/ngày]
    Filter -->|Không| LoadOrders[Tải danh sách đơn hàng]
    ApplyFilter --> LoadOrders

    LoadOrders --> SelectOrder[Chọn đơn hàng]
    SelectOrder --> ViewDetail[Xem chi tiết đơn hàng]
    ViewDetail --> CheckInfo[Kiểm tra thông tin]

    CheckInfo --> CheckStatus{Trạng thái hiện tại?}

    CheckStatus -->|PENDING| ProcessOrder{Xử lý đơn?}
    ProcessOrder -->|Hủy| CancelOrder[Cập nhật: CANCELLED]
    ProcessOrder -->|Xử lý| UpdateProcessing[Cập nhật: PROCESSING]

    CheckStatus -->|PROCESSING| PrepareOrder{Chuẩn bị hàng?}
    PrepareOrder -->|Hoàn tất| UpdateShipping[Cập nhật: SHIPPING]
    PrepareOrder -->|Hủy| CancelOrder

    CheckStatus -->|SHIPPING| DeliverOrder{Giao hàng?}
    DeliverOrder -->|Thành công| UpdateCompleted[Cập nhật: COMPLETED]
    DeliverOrder -->|Thất bại| UpdateRefunding[Cập nhật: REFUNDING]

    CheckStatus -->|COMPLETED| AlreadyDone[Đơn hàng đã hoàn thành]
    AlreadyDone --> MoreOrders

    CheckStatus -->|CANCELLED| AlreadyCancelled[Đơn hàng đã hủy]
    AlreadyCancelled --> MoreOrders

    CheckStatus -->|REFUNDING| ProcessRefund{Xử lý hoàn tiền?}
    ProcessRefund -->|Hoàn tất| UpdateRefunded[Cập nhật: REFUNDED]
    ProcessRefund -->|Chờ| MoreOrders

    CancelOrder --> NotifyCustomer[Gửi thông báo cho khách hàng]
    UpdateProcessing --> NotifyCustomer
    UpdateShipping --> NotifyCustomer
    UpdateCompleted --> NotifyCustomer
    UpdateRefunding --> NotifyCustomer
    UpdateRefunded --> NotifyCustomer

    NotifyCustomer --> SaveHistory[Lưu lịch sử thay đổi]
    SaveHistory --> Success[Thông báo thành công]
    Success --> MoreOrders{Xử lý đơn khác?}

    MoreOrders -->|Có| LoadOrders
    MoreOrders -->|Không| End([Kết thúc])

    style Start fill:#e1ffe1
    style End fill:#ffe1e1
    style NotifyCustomer fill:#e1f5ff
    style SaveHistory fill:#fff4e1
```

### 6.3. Activity Diagram - Quy trình đăng ký & đăng nhập

```mermaid
graph TD
    Start([Bắt đầu]) --> ChooseAction{Chọn hành động}

    ChooseAction -->|Đăng ký| RegisterPage[Mở trang đăng ký]
    ChooseAction -->|Đăng nhập| LoginPage[Mở trang đăng nhập]

    RegisterPage --> ChooseRegMethod{Phương thức đăng ký}
    ChooseRegMethod -->|Email/Password| FillRegForm[Điền form đăng ký]
    ChooseRegMethod -->|Google OAuth| GoogleAuthReg[Xác thực Google]

    FillRegForm --> ValidateRegForm{Validate form}
    ValidateRegForm -->|Lỗi| ShowRegError[Hiển thị lỗi]
    ShowRegError --> FillRegForm

    ValidateRegForm -->|OK| CheckEmailExists{Email tồn tại?}
    CheckEmailExists -->|Có| EmailExists[Thông báo email đã dùng]
    EmailExists --> FillRegForm

    CheckEmailExists -->|Không| HashPassword[Hash mật khẩu bcrypt]
    HashPassword --> CreateUser[Tạo user mới]
    CreateUser --> AutoLogin[Tự động đăng nhập]

    GoogleAuthReg --> CheckGoogleEmail{Email tồn tại?}
    CheckGoogleEmail -->|Có| LoginExisting[Đăng nhập với tài khoản cũ]
    CheckGoogleEmail -->|Không| CreateGoogleUser[Tạo user mới]
    CreateGoogleUser --> AutoLogin

    LoginPage --> ChooseLoginMethod{Phương thức đăng nhập}
    ChooseLoginMethod -->|Email/Password| FillLoginForm[Điền email & password]
    ChooseLoginMethod -->|Google OAuth| GoogleAuthLogin[Xác thực Google]

    FillLoginForm --> ValidateLogin{Validate credentials}
    ValidateLogin -->|Lỗi| LoginError[Thông báo lỗi]
    LoginError --> ForgotPass{Quên mật khẩu?}
    ForgotPass -->|Có| ForgotPassword[Quy trình quên mật khẩu]
    ForgotPass -->|Không| FillLoginForm

    ValidateLogin -->|OK| CheckBanned{User bị ban?}
    CheckBanned -->|Có| BannedError[Thông báo tài khoản bị khóa]
    BannedError --> End([Kết thúc])

    CheckBanned -->|Không| CreateSession[Tạo session NextAuth]

    GoogleAuthLogin --> LoginExisting
    LoginExisting --> CreateSession
    AutoLogin --> CreateSession

    CreateSession --> CheckRole{Kiểm tra role}
    CheckRole -->|ADMIN| RedirectAdmin[Redirect to /admin]
    CheckRole -->|STAFF| RedirectStaff[Redirect to /staff]
    CheckRole -->|CUSTOMER| RedirectHome[Redirect to /products]

    RedirectAdmin --> Success([Đăng nhập thành công])
    RedirectStaff --> Success
    RedirectHome --> Success

    style Start fill:#e1ffe1
    style Success fill:#e1ffe1
    style End fill:#ffe1e1
    style CreateSession fill:#fff4e1
    style GoogleAuthReg fill:#e1f5ff
    style GoogleAuthLogin fill:#e1f5ff
```

### 6.4. Activity Diagram - Quy trình quên mật khẩu

```mermaid
graph TD
    Start([Bắt đầu]) --> ClickForgot[Click 'Quên mật khẩu?']
    ClickForgot --> ForgotPage[Mở trang Forgot Password]
    ForgotPage --> EnterEmail[Nhập email]
    EnterEmail --> ValidateEmail{Email hợp lệ?}

    ValidateEmail -->|Không| EmailError[Thông báo lỗi email]
    EmailError --> EnterEmail

    ValidateEmail -->|Có| SubmitEmail[Gửi request]
    SubmitEmail --> CheckUserExists{User tồn tại?}

    CheckUserExists -->|Không| ShowSuccessAnyway[Hiển thị success<br/>phòng email enumeration]
    CheckUserExists -->|Có| DeleteOldTokens[Xóa token cũ]

    DeleteOldTokens --> GenerateOTP[Generate mã OTP 6 số]
    GenerateOTP --> SaveToken[Lưu token vào DB<br/>expiresAt: +15 phút]
    SaveToken --> SendEmail[Gửi email với OTP]
    SendEmail --> ShowSuccessAnyway

    ShowSuccessAnyway --> SuccessPage[Hiển thị trang thành công]
    SuccessPage --> CheckEmail[Kiểm tra email]
    CheckEmail --> ClickResetLink[Click link hoặc nhập mã thủ công]

    ClickResetLink --> ResetPage[Mở trang Reset Password]
    ResetPage --> EnterOTP[Nhập mã OTP 6 số]
    EnterOTP --> EnterNewPass[Nhập mật khẩu mới]
    EnterNewPass --> ConfirmPass[Xác nhận mật khẩu]

    ConfirmPass --> ValidatePass{Validate password}
    ValidatePass -->|Lỗi| PassError[Thông báo lỗi]
    PassError --> EnterNewPass

    ValidatePass -->|OK| CheckPassMatch{Mật khẩu khớp?}
    CheckPassMatch -->|Không| MatchError[Mật khẩu không khớp]
    MatchError --> EnterNewPass

    CheckPassMatch -->|Có| SubmitReset[Gửi request reset]
    SubmitReset --> ValidateToken{Token hợp lệ?}

    ValidateToken -->|Không tồn tại| TokenNotFound[Mã không hợp lệ]
    TokenNotFound --> RetryOrNew{Thử lại?}
    RetryOrNew -->|Có| ResetPage
    RetryOrNew -->|Không| RequestNew[Yêu cầu mã mới]
    RequestNew --> ForgotPage

    ValidateToken -->|Hết hạn| TokenExpired[Mã đã hết hạn<br/>Hiệu lực 15 phút]
    TokenExpired --> RequestNew

    ValidateToken -->|Đã dùng| TokenUsed[Mã đã được sử dụng]
    TokenUsed --> RequestNew

    ValidateToken -->|Hợp lệ| BeginTransaction[Bắt đầu transaction]
    BeginTransaction --> HashNewPass[Hash mật khẩu mới]
    HashNewPass --> UpdatePassword[Cập nhật password user]
    UpdatePassword --> MarkTokenUsed[Đánh dấu token used=true]
    MarkTokenUsed --> CommitTrans[Commit transaction]

    CommitTrans --> DeleteOtherTokens[Xóa token khác của email]
    DeleteOtherTokens --> ShowResetSuccess[Hiển thị thành công]
    ShowResetSuccess --> RedirectLogin[Redirect to /login]
    RedirectLogin --> End([Kết thúc])

    style Start fill:#e1ffe1
    style End fill:#e1ffe1
    style GenerateOTP fill:#fff4e1
    style SendEmail fill:#e1f5ff
    style BeginTransaction fill:#ffe1e1
```

### 6.5. Activity Diagram - Quy trình sử dụng AI Visual Search

```mermaid
graph TD
    Start([Bắt đầu]) --> OpenAI[Mở trang AI Assistant]
    OpenAI --> ChooseFeature{Chọn tính năng}

    ChooseFeature -->|Chat AI| ChatInterface[Giao diện chat]
    ChooseFeature -->|Visual Search| VisualInterface[Giao diện tìm kiếm ảnh]

    ChatInterface --> TypeQuestion[Nhập câu hỏi]
    TypeQuestion --> SendChat[Gửi tin nhắn]
    SendChat --> AIProcess[AI xử lý câu hỏi]
    AIProcess --> SearchProducts[Tìm sản phẩm liên quan]
    SearchProducts --> GenerateResponse[Tạo câu trả lời]
    GenerateResponse --> ShowChatResponse[Hiển thị trả lời + gợi ý SP]
    ShowChatResponse --> MoreChat{Chat tiếp?}
    MoreChat -->|Có| TypeQuestion
    MoreChat -->|Không| SelectProduct

    VisualInterface --> UploadImage{Upload ảnh}
    UploadImage -->|Chụp ảnh| TakePhoto[Chụp ảnh bằng camera]
    UploadImage -->|Chọn file| SelectFile[Chọn file từ thiết bị]

    TakePhoto --> ValidateImage{Validate ảnh}
    SelectFile --> ValidateImage

    ValidateImage -->|Lỗi| ImageError[Thông báo lỗi<br/>định dạng/kích thước]
    ImageError --> UploadImage

    ValidateImage -->|OK| PreviewImage[Preview ảnh]
    PreviewImage --> ConfirmSearch[Xác nhận tìm kiếm]
    ConfirmSearch --> SendToAI[Gửi ảnh đến Hugging Face API]

    SendToAI --> AIAnalyze[AI phân tích hình ảnh]
    AIAnalyze --> ExtractFeatures[Trích xuất features<br/>category, brand, specs]
    ExtractFeatures --> QueryDB[Tìm kiếm trong database]

    QueryDB --> MatchProducts[Match sản phẩm tương tự]
    MatchProducts --> RankResults[Xếp hạng kết quả<br/>theo độ tương đồng]
    RankResults --> CheckResults{Có kết quả?}

    CheckResults -->|Không| NoResults[Không tìm thấy sản phẩm]
    NoResults --> TryAgain{Thử lại?}
    TryAgain -->|Có| UploadImage
    TryAgain -->|Không| End([Kết thúc])

    CheckResults -->|Có| ShowResults[Hiển thị danh sách<br/>sản phẩm tương tự]
    ShowResults --> SortResults{Sắp xếp lại?}
    SortResults -->|Có| ApplySort[Sắp xếp theo giá/rating]
    ApplySort --> ShowResults

    SortResults -->|Không| SelectProduct[Chọn sản phẩm]
    SelectProduct --> ViewProductDetail[Xem chi tiết sản phẩm]
    ViewProductDetail --> AddCart{Thêm vào giỏ?}

    AddCart -->|Có| AddToCart[Thêm vào giỏ hàng]
    AddToCart --> ContinueSearch{Tìm tiếp?}

    AddCart -->|Không| ContinueSearch

    ContinueSearch -->|Có| ChooseFeature
    ContinueSearch -->|Không| End

    style Start fill:#e1ffe1
    style End fill:#ffe1e1
    style AIAnalyze fill:#e1f5ff
    style AIProcess fill:#e1f5ff
    style QueryDB fill:#fff4e1
```

### 6.6. Activity Diagram - Quy trình quản lý Voucher (Admin)

```mermaid
graph TD
    Start([Bắt đầu]) --> OpenVoucher[Mở trang quản lý Voucher]
    OpenVoucher --> ChooseAction{Chọn hành động}

    ChooseAction -->|Tạo mới| CreateForm[Mở form tạo voucher]
    ChooseAction -->|Xem danh sách| ListVouchers[Hiển thị danh sách voucher]

    CreateForm --> FillCode[Nhập mã voucher]
    FillCode --> ChooseType{Loại giảm giá}

    ChooseType -->|Percentage| SetPercent[Thiết lập % giảm giá]
    ChooseType -->|Fixed Amount| SetAmount[Thiết lập số tiền giảm]

    SetPercent --> SetMaxDiscount[Thiết lập giảm tối đa]
    SetMaxDiscount --> SetConditions
    SetAmount --> SetConditions[Thiết lập điều kiện]

    SetConditions --> SetMinOrder[Giá trị đơn tối thiểu]
    SetMinOrder --> SetUsageLimit[Giới hạn số lần dùng]
    SetUsageLimit --> SetValidPeriod[Thiết lập thời hạn<br/>validFrom - validUntil]

    SetValidPeriod --> ValidateVoucher{Validate thông tin}
    ValidateVoucher -->|Lỗi| ShowError[Hiển thị lỗi]
    ShowError --> CreateForm

    ValidateVoucher -->|OK| CheckCodeExists{Mã đã tồn tại?}
    CheckCodeExists -->|Có| CodeExists[Mã đã được sử dụng]
    CodeExists --> FillCode

    CheckCodeExists -->|Không| SaveVoucher[Lưu voucher vào DB]
    SaveVoucher --> SetActive[Kích hoạt voucher]
    SetActive --> Success[Thông báo thành công]
    Success --> ListVouchers

    ListVouchers --> FilterList{Lọc danh sách?}
    FilterList -->|Có| ApplyFilter[Lọc theo trạng thái/ngày]
    FilterList -->|Không| ShowList[Hiển thị danh sách]
    ApplyFilter --> ShowList

    ShowList --> SelectVoucher{Chọn voucher}
    SelectVoucher -->|Sửa| EditVoucher[Mở form chỉnh sửa]
    SelectVoucher -->|Xóa| ConfirmDelete{Xác nhận xóa?}
    SelectVoucher -->|Toggle| ToggleActive[Kích hoạt/Vô hiệu hóa]
    SelectVoucher -->|Xem chi tiết| ViewStats[Xem thống kê sử dụng]

    EditVoucher --> UpdateFields[Cập nhật thông tin]
    UpdateFields --> ValidateUpdate{Validate}
    ValidateUpdate -->|Lỗi| EditError[Hiển thị lỗi]
    EditError --> EditVoucher
    ValidateUpdate -->|OK| UpdateDB[Cập nhật DB]
    UpdateDB --> Success

    ConfirmDelete -->|Hủy| ListVouchers
    ConfirmDelete -->|Xác nhận| CheckUsage{Đã được sử dụng?}
    CheckUsage -->|Có| WarnUsed[Cảnh báo voucher đã dùng]
    WarnUsed --> ForceDelete{Vẫn xóa?}
    ForceDelete -->|Không| ListVouchers
    ForceDelete -->|Có| DeleteVoucher[Xóa khỏi DB]

    CheckUsage -->|Không| DeleteVoucher
    DeleteVoucher --> DeleteSuccess[Thông báo xóa thành công]
    DeleteSuccess --> ListVouchers

    ToggleActive --> UpdateStatus[Cập nhật trạng thái active]
    UpdateStatus --> Success

    ViewStats --> ShowUsageStats[Hiển thị:<br/>- Số lần đã dùng<br/>- Số lần còn lại<br/>- Danh sách đơn hàng]
    ShowUsageStats --> BackToList[Quay lại danh sách]
    BackToList --> ListVouchers

    ListVouchers --> Done{Hoàn tất?}
    Done -->|Có| End([Kết thúc])
    Done -->|Không| ChooseAction

    style Start fill:#e1ffe1
    style End fill:#ffe1e1
    style SaveVoucher fill:#fff4e1
    style DeleteVoucher fill:#ffe1e1
```

---

## 7. DATABASE DESIGN

### 7.1. Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Order : places
    User ||--o{ Review : writes
    User ||--o{ Notification : receives

    Category ||--o{ Product : contains

    Product ||--o{ Review : has
    Product ||--o{ PromotionEmail : featured_in

    Order ||--o{ OrderItem : contains
    Order ||--o{ Notification : generates
    Order }o--|| Voucher : uses

    User {
        string id PK
        string email UK
        string password
        string name
        enum role
        string image
        datetime emailVerified
        boolean banned
        string phone
        text address
        datetime createdAt
        datetime updatedAt
    }

    Category {
        string id PK
        string name
        string slug UK
        text description
        string image
        datetime createdAt
        datetime updatedAt
    }

    Product {
        string id PK
        string name
        string slug UK
        text description
        float price
        float salePrice
        string brand
        string categoryId FK
        json specs
        text images
        string thumbnail
        int stock
        string sku UK
        int sold
        int views
        float rating
        int reviews
        boolean featured
        boolean hot
        datetime createdAt
        datetime updatedAt
    }

    Order {
        string id PK
        string orderNumber UK
        string userId FK
        string customerName
        string customerEmail
        string customerPhone
        text shippingAddress
        float totalAmount
        float discount
        float shippingFee
        string paymentMethod
        enum paymentStatus
        enum status
        string voucherId FK
        string voucherCode
        text notes
        datetime createdAt
        datetime updatedAt
    }

    OrderItem {
        string id PK
        string orderId FK
        string productId
        string productName
        float price
        int quantity
    }

    Review {
        string id PK
        string productId FK
        string userId FK
        int rating
        text comment
        text images
        int helpful
        boolean verified
        datetime createdAt
        datetime updatedAt
    }

    Voucher {
        string id PK
        string code UK
        text description
        enum discountType
        float discountValue
        float minOrderValue
        float maxDiscount
        int usageLimit
        int usedCount
        datetime validFrom
        datetime validUntil
        boolean active
        datetime createdAt
        datetime updatedAt
    }

    Notification {
        string id PK
        string title
        text message
        enum type
        boolean read
        string userId FK
        string orderId FK
        datetime createdAt
        datetime updatedAt
    }

    PromotionEmail {
        string id PK
        string productId FK
        int discountPercent
        datetime validUntil
        int sentTo
        int successCount
        int failCount
        string sentBy
        datetime sentAt
    }

    PasswordReset {
        string id PK
        string email
        string token UK
        datetime expiresAt
        boolean used
        datetime createdAt
    }
```

### 7.2. Database Schema Summary

#### Tables

1. **users** - Quản lý người dùng
   - Roles: CUSTOMER, ADMIN, STAFF
   - Authentication: Email/Password, Google OAuth
   - Profile: phone, address, avatar

2. **categories** - Danh mục sản phẩm
   - Unique slug
   - Category image

3. **products** - Sản phẩm
   - Pricing: price, salePrice
   - Inventory: stock, sku
   - Stats: sold, views, rating
   - Features: featured, hot
   - Relations: category, reviews

4. **orders** - Đơn hàng
   - Order tracking: orderNumber
   - Customer info
   - Payment: method, status
   - Order status workflow
   - Voucher integration
   - Shipping address

5. **order_items** - Chi tiết đơn hàng
   - Product snapshot (name, price)
   - Quantity

6. **reviews** - Đánh giá sản phẩm
   - Rating 1-5 stars
   - Comment with images
   - Verified purchase flag

7. **vouchers** - Mã giảm giá
   - Discount types: PERCENTAGE, FIXED_AMOUNT
   - Usage limits
   - Validity period
   - Min order value

8. **notifications** - Thông báo
   - Types: INFO, SUCCESS, WARNING, ERROR, ORDER
   - User notifications
   - Order notifications

9. **promotion_emails** - Lịch sử email khuyến mãi
   - Product promotion
   - Send statistics
   - Success/fail tracking

10. **password_resets** - Đặt lại mật khẩu
    - OTP token (6 digits)
    - Expiration (15 minutes)
    - One-time use

---

## 8. SEQUENCE DIAGRAMS

### 8.1. Quy trình đăng ký tài khoản

```mermaid
sequenceDiagram
    actor User as 👤 Người dùng
    participant UI as 📱 Register Page
    participant API as 🔌 API /auth/register
    participant DB as 💾 Database
    participant Auth as 🔐 NextAuth

    User->>UI: Nhập thông tin đăng ký
    User->>UI: Click "Đăng ký"

    UI->>UI: Validate form
    alt Validation fails
        UI-->>User: Hiển thị lỗi
    end

    UI->>API: POST /api/auth/register
    Note over API: { name, email, password }

    API->>DB: Check email exists
    alt Email đã tồn tại
        DB-->>API: Email exists
        API-->>UI: Error: Email đã được sử dụng
        UI-->>User: Thông báo lỗi
    end

    API->>API: Hash password (bcrypt)
    API->>DB: Create new user
    DB-->>API: User created

    API->>Auth: Sign out existing session
    Auth-->>API: Session cleared

    API->>Auth: Sign in with credentials
    Auth->>DB: Verify credentials
    DB-->>Auth: User data
    Auth-->>API: Session created

    API-->>UI: Success
    UI-->>User: Redirect to /products
    User->>UI: Vào trang sản phẩm
```

### 8.2. Quy trình đặt hàng

```mermaid
sequenceDiagram
    actor Customer as 👤 Khách hàng
    participant Cart as 🛒 Cart Page
    participant Checkout as 💳 Checkout Page
    participant API as 🔌 API /orders
    participant VoucherAPI as 🎟️ API /vouchers
    participant DB as 💾 Database
    participant Email as 📧 Email Service
    participant NotifAPI as 🔔 Notification API

    Customer->>Cart: Xem giỏ hàng
    Customer->>Cart: Click "Thanh toán"
    Cart->>Checkout: Chuyển đến checkout

    Customer->>Checkout: Nhập thông tin giao hàng
    Customer->>Checkout: Nhập mã voucher

    Checkout->>VoucherAPI: POST /api/vouchers/validate
    VoucherAPI->>DB: Validate voucher
    alt Voucher hợp lệ
        DB-->>VoucherAPI: Voucher valid
        VoucherAPI-->>Checkout: Discount amount
        Checkout->>Checkout: Tính lại tổng tiền
    else Voucher không hợp lệ
        DB-->>VoucherAPI: Invalid
        VoucherAPI-->>Checkout: Error
        Checkout-->>Customer: Thông báo voucher không hợp lệ
    end

    Customer->>Checkout: Click "Đặt hàng"

    Checkout->>API: POST /api/orders
    Note over API: Order data + items

    API->>DB: Begin transaction
    API->>DB: Create order
    API->>DB: Create order items

    loop For each product
        API->>DB: Update stock (stock - quantity)
        API->>DB: Update sold count
    end

    alt Voucher used
        API->>DB: Update voucher usedCount
        API->>DB: Link voucher to order
    end

    API->>DB: Create admin notification
    Note over DB: "Đơn hàng mới #12345"

    API->>DB: Commit transaction
    DB-->>API: Order created

    API-->>Checkout: Success + orderNumber

    Checkout->>Email: Send confirmation email
    Email-->>Customer: Email xác nhận đơn hàng

    Checkout-->>Customer: Redirect to success page
    Customer->>Checkout: Xem thông tin đơn hàng
```

### 8.3. Quy trình cập nhật trạng thái đơn hàng

```mermaid
sequenceDiagram
    actor Admin as 👨‍💼 Admin
    participant UI as 📱 Admin Order Page
    participant API as 🔌 API /orders/[id]
    participant DB as 💾 Database
    participant NotifDB as 🔔 Notification DB
    participant Customer as 👤 Khách hàng

    Admin->>UI: Mở chi tiết đơn hàng
    UI->>API: GET /api/orders/[id]
    API->>DB: Fetch order
    DB-->>API: Order data
    API-->>UI: Display order

    Admin->>UI: Chọn trạng thái mới
    Admin->>UI: Click "Cập nhật"

    UI->>API: PATCH /api/orders/[id]
    Note over API: { status: "SHIPPING" }

    API->>DB: Get current order
    DB-->>API: Current status

    API->>DB: Update order status
    DB-->>API: Updated

    alt Status changed
        API->>NotifDB: Create user notification
        Note over NotifDB: "Đơn hàng đang giao"
        NotifDB-->>API: Notification created
    end

    API-->>UI: Success
    UI-->>Admin: Thông báo cập nhật thành công

    Note over Customer: Auto-refresh notifications
    Customer->>NotifDB: GET /api/notifications
    NotifDB-->>Customer: New notification
    Customer->>Customer: Hiển thị thông báo mới
```

### 8.4. Quy trình quên mật khẩu

```mermaid
sequenceDiagram
    actor User as 👤 Người dùng
    participant ForgotPage as 📱 Forgot Password Page
    participant ResetPage as 📱 Reset Password Page
    participant ForgotAPI as 🔌 API /forgot-password
    participant ResetAPI as 🔌 API /reset-password
    participant DB as 💾 Database
    participant Email as 📧 Email Service

    User->>ForgotPage: Nhập email
    User->>ForgotPage: Click "Gửi mã"

    ForgotPage->>ForgotAPI: POST /api/auth/forgot-password
    Note over ForgotAPI: { email }

    ForgotAPI->>DB: Check user exists
    alt User exists
        DB-->>ForgotAPI: User found

        ForgotAPI->>DB: Delete old tokens
        ForgotAPI->>ForgotAPI: Generate 6-digit OTP

        ForgotAPI->>DB: Create password reset
        Note over DB: token, expiresAt (15 min)

        ForgotAPI->>Email: Send reset email
        Note over Email: OTP code + reset link
        Email-->>User: Email với mã OTP
    end

    ForgotAPI-->>ForgotPage: Success (always)
    Note over ForgotAPI: Prevent email enumeration

    ForgotPage-->>User: Hiển thị thành công

    User->>ResetPage: Mở link hoặc nhập mã
    User->>ResetPage: Nhập OTP + mật khẩu mới
    User->>ResetPage: Click "Đặt lại mật khẩu"

    ResetPage->>ResetAPI: POST /api/auth/reset-password
    Note over ResetAPI: { token, newPassword }

    ResetAPI->>DB: Find token
    alt Token not found
        DB-->>ResetAPI: Not found
        ResetAPI-->>ResetPage: Error: Mã không hợp lệ
    end

    alt Token expired
        ResetAPI->>ResetAPI: Check expiresAt
        ResetAPI-->>ResetPage: Error: Mã đã hết hạn
    end

    alt Token already used
        ResetAPI-->>ResetPage: Error: Mã đã được sử dụng
    end

    ResetAPI->>ResetAPI: Hash new password

    ResetAPI->>DB: Begin transaction
    ResetAPI->>DB: Update user password
    ResetAPI->>DB: Mark token as used
    ResetAPI->>DB: Commit transaction

    ResetAPI->>DB: Delete other unused tokens

    ResetAPI-->>ResetPage: Success
    ResetPage-->>User: Hiển thị thành công
    User->>ResetPage: Click "Đăng nhập"
```

### 8.5. Quy trình sử dụng AI Visual Search

```mermaid
sequenceDiagram
    actor User as 👤 Người dùng
    participant UI as 📱 AI Assistant Page
    participant API as 🔌 API /ai/visual-search
    participant HF as 🤖 Hugging Face API
    participant DB as 💾 Database

    User->>UI: Upload hình ảnh
    User->>UI: Click "Tìm kiếm"

    UI->>API: POST /api/ai/visual-search
    Note over API: FormData with image

    API->>API: Validate image
    alt Invalid image
        API-->>UI: Error: Invalid image
    end

    API->>HF: Analyze image
    Note over HF: Image classification
    HF-->>API: Image features/tags

    API->>DB: Search products
    Note over API: Match by category, brand, specs
    DB-->>API: Similar products

    API-->>UI: Search results
    UI-->>User: Hiển thị sản phẩm tương tự
```

---

## 9. COMPONENT ARCHITECTURE

### 9.1. System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[🌐 Web Browser]
        Mobile[📱 Mobile Browser]
    end

    subgraph "Presentation Layer - Next.js 15"
        Pages[📄 Pages<br/>App Router]
        Components[🧩 Components<br/>React]
        Styles[🎨 Tailwind CSS]
    end

    subgraph "API Layer - Next.js API Routes"
        AuthAPI[🔐 Auth APIs]
        ProductAPI[📦 Product APIs]
        OrderAPI[🛒 Order APIs]
        AdminAPI[👨‍💼 Admin APIs]
        AIAPI[🤖 AI APIs]
        NotifAPI[🔔 Notification APIs]
    end

    subgraph "Business Logic Layer"
        AuthService[🔐 NextAuth]
        EmailService[📧 Nodemailer]
        AIService[🤖 Hugging Face]
        Validation[✅ Validators]
    end

    subgraph "Data Access Layer"
        Prisma[🔷 Prisma ORM]
    end

    subgraph "Database Layer"
        MySQL[(💾 MySQL<br/>Database)]
    end

    subgraph "External Services"
        GoogleOAuth[🔑 Google OAuth]
        GmailSMTP[📧 Gmail SMTP]
        HuggingFace[🤖 Hugging Face API]
    end

    Browser --> Pages
    Mobile --> Pages

    Pages --> Components
    Pages --> Styles

    Components --> AuthAPI
    Components --> ProductAPI
    Components --> OrderAPI
    Components --> AdminAPI
    Components --> AIAPI
    Components --> NotifAPI

    AuthAPI --> AuthService
    AuthAPI --> Prisma

    ProductAPI --> Prisma
    ProductAPI --> Validation

    OrderAPI --> Prisma
    OrderAPI --> Validation
    OrderAPI --> EmailService

    AdminAPI --> Prisma
    AdminAPI --> Validation
    AdminAPI --> EmailService

    AIAPI --> AIService
    AIAPI --> Prisma

    NotifAPI --> Prisma

    AuthService --> GoogleOAuth
    AuthService --> Prisma

    EmailService --> GmailSMTP

    AIService --> HuggingFace

    Prisma --> MySQL

    style Browser fill:#e1f5ff
    style Mobile fill:#e1f5ff
    style Pages fill:#ffe1e1
    style MySQL fill:#e1ffe1
```

### 9.2. Folder Structure

```
tech-ecommerce-ai/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (auth)/                   # Auth routes group
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── 📁 admin/                    # Admin dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── products/
│   │   ├── orders/
│   │   ├── users/
│   │   ├── vouchers/
│   │   └── settings/
│   ├── 📁 staff/                    # Staff portal
│   │   ├── login/
│   │   └── page.tsx
│   ├── 📁 api/                      # API Routes
│   │   ├── auth/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── admin/
│   │   ├── ai/
│   │   ├── notifications/
│   │   └── vouchers/
│   ├── products/                    # Product pages
│   ├── cart/                        # Shopping cart
│   ├── checkout/                    # Checkout
│   ├── orders/                      # Order tracking
│   ├── profile/                     # User profile
│   ├── ai-assistant/                # AI features
│   └── layout.tsx                   # Root layout
│
├── 📁 components/                   # React components
│   ├── admin/                       # Admin components
│   ├── layout/                      # Layout components
│   ├── products/                    # Product components
│   └── ui/                          # UI components
│
├── 📁 lib/                          # Utilities
│   ├── db/                          # Database
│   │   └── prisma.ts
│   ├── auth.ts                      # NextAuth config
│   ├── email.ts                     # Email service
│   └── utils.ts                     # Helpers
│
├── 📁 prisma/                       # Prisma ORM
│   ├── schema.prisma                # Database schema
│   └── migrations/
│
├── 📁 public/                       # Static files
│   ├── images/
│   └── uploads/
│
└── 📁 styles/                       # Global styles
    └── globals.css
```

---

## 10. TÍNH NĂNG NỔI BẬT

### 10.1. Tích hợp AI

#### 10.1.1. AI Chatbot
- Trợ lý ảo tư vấn sản phẩm
- Trả lời câu hỏi khách hàng
- Gợi ý sản phẩm dựa trên nhu cầu
- Tích hợp Hugging Face API

#### 10.1.2. Visual Search
- Tìm kiếm sản phẩm bằng hình ảnh
- AI phân tích và nhận diện sản phẩm
- Gợi ý sản phẩm tương tự
- UX/UI thân thiện

### 10.2. Hệ thống thông báo Real-time

#### 10.2.1. Thông báo cho Admin
- Tự động nhận thông báo khi có đơn hàng mới
- Badge đếm số thông báo chưa đọc
- Auto-refresh mỗi 30 giây
- Dropdown menu đẹp mắt
- Link trực tiếp đến đơn hàng

#### 10.2.2. Thông báo cho Customer
- Nhận thông báo khi đơn hàng thay đổi trạng thái
- Timeline theo dõi đơn hàng
- Thông báo đa dạng (INFO, SUCCESS, WARNING, ERROR)
- Real-time updates

### 10.3. Voucher & Khuyến mãi

#### 10.3.1. Hệ thống Voucher linh hoạt
- 2 loại voucher: Phần trăm & Số tiền cố định
- Giới hạn số lần sử dụng
- Thiết lập thời hạn
- Giá trị đơn hàng tối thiểu
- Giảm giá tối đa cho voucher %
- Validation chi tiết

#### 10.3.2. Email Marketing
- Gửi email khuyến mãi hàng loạt
- Template email đẹp mắt
- Tracking thống kê gửi email
- Đếm số lượng thành công/thất bại

### 10.4. Bảo mật & Xác thực

#### 10.4.1. Multiple Authentication
- Email/Password authentication
- Google OAuth 2.0
- Session management với NextAuth.js
- Secure password hashing (bcrypt)

#### 10.4.2. Password Reset
- Gửi OTP 6 số qua email
- Token có thời hạn 15 phút
- One-time use token
- Email template chuyên nghiệp
- Prevent email enumeration

#### 10.4.3. Role-based Access Control
- 3 roles: CUSTOMER, STAFF, ADMIN
- Middleware bảo vệ routes
- API authorization
- Route protection

### 10.5. UX/UI Modern

#### 10.5.1. Responsive Design
- Mobile-first approach
- Tailwind CSS
- Component library với Lucide icons
- Dark/Light mode ready

#### 10.5.2. User Experience
- Toast notifications (react-hot-toast)
- Loading states
- Error handling
- Form validation
- Smooth transitions
- Skeleton loaders

### 10.6. Admin Dashboard

#### 10.6.1. Comprehensive Statistics
- Tổng doanh thu
- Tổng đơn hàng
- Tổng khách hàng
- Biểu đồ doanh thu
- Top sản phẩm bán chạy
- Sản phẩm sắp hết hàng

#### 10.6.2. Order Management
- Real-time order updates
- Status workflow
- Filter & search
- Order details
- Print invoice ready

### 10.7. Product Management

#### 10.7.1. Rich Product Data
- Multiple images
- Product specifications (JSON)
- Stock management
- SKU tracking
- Sales analytics
- Rating & reviews

#### 10.7.2. Advanced Filtering
- Filter by category
- Filter by price range
- Filter by brand
- Sort options
- Search functionality
- Visual search (AI)

### 10.8. Review System

#### 10.8.1. Customer Reviews
- 5-star rating
- Written reviews
- Photo uploads
- Verified purchase badge
- Helpful votes
- Review moderation ready

---

## 11. KẾT LUẬN

### 11.1. Thành tựu đạt được

Dự án **SHOP QM E-Commerce Platform** đã hoàn thành đầy đủ các chức năng của một hệ thống thương mại điện tử hiện đại:

✅ **Hoàn thiện 100% chức năng cơ bản**
- Quản lý sản phẩm, đơn hàng, người dùng
- Giỏ hàng và checkout
- Authentication & Authorization
- Review system

✅ **Tính năng nâng cao**
- AI Assistant & Visual Search
- Real-time notifications
- Voucher system
- Email marketing
- Password reset với OTP

✅ **Bảo mật**
- Role-based access control
- Secure authentication
- Password hashing
- Token-based password reset

✅ **UX/UI chuyên nghiệp**
- Responsive design
- Modern UI components
- Toast notifications
- Loading states

### 11.2. Công nghệ hiện đại

- Next.js 15 với App Router
- TypeScript cho type safety
- Prisma ORM
- NextAuth.js authentication
- Tailwind CSS
- AI integration

### 11.3. Khả năng mở rộng

Hệ thống được thiết kế với kiến trúc module hóa, dễ dàng mở rộng:
- Thêm payment gateways (Stripe, PayPal)
- Tích hợp logistics APIs
- Multi-language support
- Mobile app (React Native)
- Admin analytics dashboard
- Inventory management system

---

## PHỤ LỤC

### A. API Endpoints

#### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Reset mật khẩu
- `GET /api/auth/me` - Get user info

#### Products
- `GET /api/products` - List products
- `GET /api/products/[id]` - Get product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/[id]` - Update product (Admin)
- `DELETE /api/products/[id]` - Delete product (Admin)

#### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/[id]` - Get order
- `POST /api/orders` - Create order
- `PATCH /api/orders/[id]` - Update order status (Admin/Staff)
- `POST /api/orders/[id]/cancel` - Cancel order

#### Vouchers
- `GET /api/admin/vouchers` - List vouchers (Admin)
- `POST /api/admin/vouchers` - Create voucher (Admin)
- `PUT /api/admin/vouchers/[id]` - Update voucher (Admin)
- `DELETE /api/admin/vouchers/[id]` - Delete voucher (Admin)
- `POST /api/vouchers/validate` - Validate voucher

#### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/admin/notifications` - Get admin notifications
- `PATCH /api/notifications` - Mark as read
- `DELETE /api/notifications` - Delete notification

#### AI
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/visual-search` - Visual search

#### Reviews
- `GET /api/reviews/[productId]` - Get product reviews
- `POST /api/reviews` - Create review

### B. Environment Variables

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/shop_qm"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3004"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI
HUGGINGFACE_API_KEY="your-huggingface-api-key"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="SHOP QM <your-email@gmail.com>"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3004"
```

### C. Database Indexes

Các indexes được tối ưu cho performance:

- **users**: email, role
- **products**: slug, categoryId, featured, hot, brand
- **orders**: userId, status, paymentStatus, orderNumber
- **reviews**: productId, userId, rating
- **notifications**: userId, read, createdAt
- **vouchers**: code, active, validFrom, validUntil

---

**Sinh viên thực hiện:** [Tên sinh viên]
**MSSV:** [Mã số sinh viên]
**Lớp:** [Lớp]
**Giảng viên hướng dẫn:** [Tên giảng viên]
**Năm học:** 2024-2025

---

*Báo cáo được tạo tự động bởi Claude AI Assistant*
