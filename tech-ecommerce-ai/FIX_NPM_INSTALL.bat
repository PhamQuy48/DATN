@echo off
echo ========================================
echo    FIX VA CAI DAT NPM TU DONG
echo ========================================
echo.

echo [Buoc 1/6] Kiem tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Chua cai dat Node.js!
    echo Vui long tai tai: https://nodejs.org/
    pause
    exit /b 1
) else (
    node --version
    echo [OK] Node.js da co
)

echo.
echo [Buoc 2/6] Xoa thu muc node_modules cu...
if exist "node_modules" (
    echo Dang xoa node_modules... (co the mat vai giay)
    rmdir /s /q node_modules
    echo [OK] Da xoa node_modules
) else (
    echo [!] Khong co node_modules de xoa
)

echo.
echo [Buoc 3/6] Xoa package-lock.json...
if exist "package-lock.json" (
    del /f package-lock.json
    echo [OK] Da xoa package-lock.json
) else (
    echo [!] Khong co package-lock.json de xoa
)

echo.
echo [Buoc 4/6] Xoa cache npm...
echo Dang xoa cache...
call npm cache clean --force
if errorlevel 1 (
    echo [!] Xoa cache co loi nhung tiep tuc...
) else (
    echo [OK] Da xoa cache npm
)

echo.
echo [Buoc 5/6] Cap nhat npm len phien ban moi nhat...
echo Dang cap nhat npm...
call npm install -g npm@latest
if errorlevel 1 (
    echo [!] Cap nhat npm co loi nhung tiep tuc...
) else (
    npm --version
    echo [OK] Da cap nhat npm
)

echo.
echo [Buoc 6/6] Cai dat dependencies...
echo (Qua trinh nay mat 3-5 phut, vui long cho...)
echo.

REM Thu cach 1: --legacy-peer-deps
echo Thu cach 1: npm install --legacy-peer-deps
call npm install --legacy-peer-deps

if errorlevel 1 (
    echo.
    echo [!] Cach 1 that bai, thu cach 2...
    echo.

    REM Thu cach 2: --force
    echo Thu cach 2: npm install --force
    call npm install --force

    if errorlevel 1 (
        echo.
        echo [!] Cach 2 that bai, thu cach 3...
        echo.

        REM Thu cach 3: Binh thuong
        echo Thu cach 3: npm install
        call npm install

        if errorlevel 1 (
            echo.
            echo [X] TAT CA CACH DEU THAT BAI!
            echo.
            echo Vui long:
            echo 1. Kiem tra ket noi internet
            echo 2. Chay file nay voi quyen Administrator
            echo 3. Hoac chay thu cong: npm install --legacy-peer-deps
            echo.
            pause
            exit /b 1
        )
    )
)

echo.
echo ========================================
echo    CAI DAT THANH CONG!
echo ========================================
echo.
echo Dependencies da duoc cai dat thanh cong!
echo.
echo Cac buoc tiep theo:
echo 1. Chay: npm run dev
echo 2. Hoac double-click: KHOI_DONG_NHANH.bat
echo 3. Mo trinh duyet: http://localhost:3002
echo.

pause
