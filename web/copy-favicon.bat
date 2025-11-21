@echo off
chcp 65001 >nul
echo.
echo ===================================
echo   Copy Tharo Favicon
echo ===================================
echo.

set "SOURCE=D:\YTB\NĂNG ĐÔNG TUỔI VÀNG\tập 1\apple-touch-icon.png"
set "DEST1=app\icon.png"
set "DEST2=app\apple-icon.png"

echo Copying favicon files...
echo.

copy /Y "%SOURCE%" "%DEST1%"
if %errorlevel% equ 0 (
    echo [OK] Copied to app\icon.png
) else (
    echo [ERROR] Failed to copy icon.png
    goto :error
)

copy /Y "%SOURCE%" "%DEST2%"
if %errorlevel% equ 0 (
    echo [OK] Copied to app\apple-icon.png
) else (
    echo [ERROR] Failed to copy apple-icon.png
    goto :error
)

echo.
echo ===================================
echo   SUCCESS! Favicon updated!
echo ===================================
echo.
echo Next steps:
echo 1. Restart dev server: npm run dev
echo 2. Hard refresh browser: Ctrl + F5
echo.
pause
exit /b 0

:error
echo.
echo ===================================
echo   ERROR! Please copy manually
echo ===================================
echo.
echo Source: %SOURCE%
echo.
echo Destinations:
echo - %DEST1%
echo - %DEST2%
echo.
pause
exit /b 1

