@echo off
chcp 65001 >nul
echo ========================================
echo  SETUP DATABASE - SHOP QM
echo ========================================
echo.

echo [1/5] Kiểm tra MySQL...
C:\xampp\mysql\bin\mysql.exe -u root -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MySQL chưa chạy!
    echo.
    echo Vui lòng:
    echo 1. Mở XAMPP Control Panel
    echo 2. Click "Start" bên cạnh MySQL
    echo 3. Chạy lại script này
    echo.
    pause
    exit /b 1
)
echo ✓ MySQL đang chạy

echo.
echo [2/5] Tạo database shopqm_db...
C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS shopqm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %errorlevel% equ 0 (
    echo ✓ Database đã tạo thành công
) else (
    echo [ERROR] Không thể tạo database
    pause
    exit /b 1
)

echo.
echo [3/5] Generate Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Không thể generate Prisma Client
    pause
    exit /b 1
)
echo ✓ Prisma Client đã generate

echo.
echo [4/5] Migrate database (tạo tables)...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo [ERROR] Migration thất bại
    pause
    exit /b 1
)
echo ✓ Tables đã được tạo

echo.
echo [5/5] Kiểm tra tables...
C:\xampp\mysql\bin\mysql.exe -u root -D shopqm_db -e "SHOW TABLES;"

echo.
echo ========================================
echo  HOÀN TẤT!
echo ========================================
echo.
echo ✓ Database: shopqm_db
echo ✓ Tables: Đã tạo
echo ✓ Connection: OK
echo.
echo Truy cập database:
echo - phpMyAdmin: http://localhost/phpmyadmin
echo - Prisma Studio: npx prisma studio
echo.
pause
