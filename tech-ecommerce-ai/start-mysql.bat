@echo off
echo ====================================
echo    KHOI DONG MYSQL CHO SHOP QM
echo ====================================
echo.

echo [Buoc 1] Dung cac tien trinh MySQL cu...
taskkill /F /IM mysqld.exe 2>nul
timeout /t 3 >nul

echo.
echo [Buoc 2] Khoi dong MySQL...
start "" "C:\xampp\mysql_start.bat"

echo.
echo Cho MySQL khoi dong (10 giay)...
timeout /t 10 >nul

echo.
echo [Buoc 3] Kiem tra ket noi...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "SHOW DATABASES;" 2>nul

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   THANH CONG! MySQL da san sang!
    echo ========================================
    echo.
    echo Database: shopqm_db
    echo Username: root
    echo Password: ^(de trong^)
    echo.
    echo Ban co the chay: npm run dev
    echo.
) else (
    echo.
    echo ========================================
    echo   LOI! Khong ket noi duoc MySQL
    echo ========================================
    echo.
    echo Hay thu:
    echo 1. Mo XAMPP Control Panel
    echo 2. Nhan Start ben canh MySQL
    echo 3. Doi den khi hien "Running"
    echo.
)

pause
