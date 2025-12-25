@echo off
echo ====================================
echo    KHAC PHUC LOI MYSQL XAMPP
echo ====================================
echo.

echo [1/3] Dung MySQL neu dang chay...
taskkill /F /IM mysqld.exe 2>nul
timeout /t 2 >nul

echo.
echo [2/3] Xoa file log bi loi...
cd C:\xampp\mysql\data
if exist ib_logfile0 (
    echo - Backup va xoa ib_logfile0...
    move ib_logfile0 ib_logfile0.bak >nul 2>&1
)
if exist ib_logfile1 (
    echo - Backup va xoa ib_logfile1...
    move ib_logfile1 ib_logfile1.bak >nul 2>&1
)

echo.
echo [3/3] Khoi dong lai MySQL...
echo HAY MO XAMPP CONTROL PANEL VA NHAN START!
echo.
echo Sau khi khoi dong xong, chay lenh nay:
echo     cd tech-ecommerce-ai
echo     npm run dev
echo.
pause
