@echo off
echo ========================================
echo    SHOP QM - CAI DAT LAN DAU
echo ========================================
echo.

echo [Buoc 1/5] Kiem tra Node.js...
node --version
if errorlevel 1 (
    echo [X] Chua cai dat Node.js!
    echo Vui long tai tai: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js da san sang
echo.

echo [Buoc 2/5] Xoa cache cu (neu co)...
if exist "node_modules" (
    echo Dang xoa node_modules cu...
    rmdir /s /q node_modules
)
if exist "package-lock.json" (
    del /f package-lock.json
)
if exist ".next" (
    echo Dang xoa .next cache...
    rmdir /s /q .next
)
echo [OK] Da xoa cache
echo.

echo [Buoc 3/5] Cai dat dependencies...
echo (Co the mat 3-5 phut, vui long cho...)
call npm install
if errorlevel 1 (
    echo [X] Cai dat that bai!
    pause
    exit /b 1
)
echo [OK] Cai dat thanh cong
echo.

echo [Buoc 4/5] Kiem tra file .env...
if not exist ".env" (
    echo [!] Chua co file .env
    echo Tao file .env mac dinh...
    (
        echo # Database MySQL
        echo DATABASE_URL="mysql://root:@localhost:3306/shopqm_db"
        echo.
        echo # App URL
        echo NEXT_PUBLIC_APP_URL="http://localhost:3002"
    ) > .env
    echo [OK] Da tao file .env
) else (
    echo [OK] File .env da ton tai
)
echo.

echo [Buoc 5/5] Cai dat Prisma...
echo Dang generate Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo [!] Prisma generate co loi (co the bo qua neu khong dung database)
) else (
    echo [OK] Prisma Client da duoc tao
)
echo.

echo ========================================
echo    CAI DAT HOAN TAT!
echo ========================================
echo.
echo Cac buoc tiep theo:
echo 1. Neu can database: Mo XAMPP va Start MySQL
echo 2. Chay file: KHOI_DONG_NHANH.bat
echo 3. Hoac chay lenh: npm run dev
echo 4. Truy cap: http://localhost:3002
echo.
echo Xem huong dan chi tiet tai: HUONG_DAN_KHOI_DONG.md
echo.

pause
