@echo off
echo ========================================
echo  Shopify Bundle App - Setup Script
echo ========================================
echo.

echo Installing dependencies...
call npm install

echo.
echo Checking project structure...
if not exist "app\entry.client.tsx" (
    echo ERROR: Missing app\entry.client.tsx
)
if not exist "app\entry.server.tsx" (
    echo ERROR: Missing app\entry.server.tsx
)
if not exist "app\root.tsx" (
    echo ERROR: Missing app\root.tsx
)
if not exist "vite.config.ts" (
    echo ERROR: Missing vite.config.ts
)

echo.
echo Running TypeScript check...
call npm run typecheck

echo.
echo Attempting to build...
call npm run build

echo.
echo ========================================
echo Setup complete!
echo.
echo To run the development server:
echo   npm run dev
echo.
echo To push to GitHub:
echo   git init
echo   git add .
echo   git commit -m "Initial commit"
echo   git remote add origin [your-github-url]
echo   git push -u origin main
echo ========================================
pause