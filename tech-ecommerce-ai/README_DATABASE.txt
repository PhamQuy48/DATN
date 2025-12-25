╔══════════════════════════════════════════════════════════════╗
║         HƯỚNG DẪN SETUP DATABASE - SHOP QM                   ║
╚══════════════════════════════════════════════════════════════╝

📦 ĐÃ CÀI ĐẶT: XAMPP được tìm thấy tại C:\xampp

🚀 CÁCH SETUP TỰ ĐỘNG (KHUYẾN NGHỊ):

   Bước 1: Khởi động MySQL
   -------------------------
   Double-click file: start-mysql.bat

   Hoặc thủ công:
   1. Mở XAMPP Control Panel
   2. Click "Start" bên cạnh MySQL
   3. Đợi status = "Running" (màu xanh)

   Bước 2: Setup Database
   -------------------------
   Double-click file: setup-database.bat

   Script này sẽ tự động:
   ✓ Tạo database shopqm_db
   ✓ Generate Prisma Client
   ✓ Migrate tables
   ✓ Kiểm tra kết nối

⚙️ CÁCH SETUP THỦ CÔNG:

   1. Start MySQL (qua XAMPP Control Panel)

   2. Tạo database:
      - Mở: http://localhost/phpmyadmin
      - Username: root, Password: (để trống)
      - Tab "Databases" → Tạo: shopqm_db

   3. Chạy lệnh trong terminal:
      cd C:\Users\TTC\Documents\DATN\tech-ecommerce-ai
      npx prisma generate
      npx prisma migrate dev --name init

🌐 TRUY CẬP DATABASE:

   📊 phpMyAdmin (Web-based):
      URL: http://localhost/phpmyadmin
      Username: root
      Password: (để trống)

   🎨 Prisma Studio (GUI đẹp):
      Lệnh: npx prisma studio
      URL: http://localhost:5555

🔧 XỬ LÝ LỖI:

   Lỗi: "Can't connect to MySQL"
   → Giải pháp: Start MySQL trong XAMPP Control Panel

   Lỗi: "Database doesn't exist"
   → Giải pháp: Chạy lại setup-database.bat

   Lỗi: "Port 3306 is in use"
   → Giải pháp: Đóng các app khác dùng MySQL

📁 CẤU HÌNH:

   File .env đã được cấu hình:
   DATABASE_URL="mysql://root:@localhost:3306/shopqm_db"

   File prisma/schema.prisma:
   provider = "mysql"

📚 TÀI LIỆU CHI TIẾT:

   - SETUP_DATABASE_NHANH.md - Setup 5 phút
   - HUONG_DAN_DATABASE.md - Chi tiết đầy đủ

═══════════════════════════════════════════════════════════════

✨ SAU KHI SETUP:

   Website: http://localhost:3002
   Admin:   http://localhost:3002/admin
   DB:      http://localhost/phpmyadmin

🎉 Chúc thành công!
