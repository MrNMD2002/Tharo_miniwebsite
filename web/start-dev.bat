@echo off
echo ===============================================
echo   THARO AO DAI - Starting Development Server
echo ===============================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo [2/4] Checking port 3001...
netstat -ano | findstr :3001 >nul 2>&1
if not errorlevel 1 (
    echo ⚠ Port 3001 is already in use
    echo Attempting to free port 3001...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        echo Killing process %%a...
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 >nul
    echo ✓ Port 3001 is now free
) else (
    echo ✓ Port 3001 is available
)

echo.
echo [3/4] Installing dependencies (if needed)...
if not exist "node_modules" (
    echo Installing packages...
    call npm install
) else (
    echo ✓ Dependencies already installed
)

echo.
echo [4/4] Starting Next.js development server...
echo.
echo ╔════════════════════════════════════════╗
echo ║  Server will start at:                 ║
echo ║  http://localhost:3001                 ║
echo ╚════════════════════════════════════════╝
echo.
echo ⌛ Please wait for "Ready in X.Xs"...
echo 🛑 Press Ctrl+C to stop the server
echo.

call npm run dev

if errorlevel 1 (
    echo.
    echo ❌ Server failed to start!
    echo Check the error messages above.
    pause
    exit /b 1
)

pause
