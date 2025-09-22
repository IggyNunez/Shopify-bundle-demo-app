@echo off
echo.
echo ========================================
echo  Preparing Shopify Bundle App for GitHub
echo ========================================
echo.

REM Check if .env exists and create .env.example
if exist .env (
    if not exist .env.example (
        echo Creating .env.example from .env...
        copy .env .env.example
        echo Done!
    )
)

REM Create .gitignore if it doesn't exist
if not exist .gitignore (
    echo Creating .gitignore...
    echo node_modules/ > .gitignore
    echo .env >> .gitignore
    echo .env.local >> .gitignore
    echo build/ >> .gitignore
    echo dist/ >> .gitignore
    echo .cache/ >> .gitignore
    echo .oxygen/ >> .gitignore
    echo Done!
)

REM Check for sensitive data
echo.
echo Checking for sensitive data...
findstr /i "shpat_ shpss_ myshopify.com" *.* 2>nul
if %errorlevel%==0 (
    echo WARNING: Found potential sensitive data in files!
    echo Please review and remove before pushing to GitHub.
) else (
    echo No sensitive patterns detected.
)

echo.
echo ========================================
echo  Pre-GitHub Checklist:
echo ========================================
echo.
echo [ ] 1. All entry files created (entry.client.tsx, entry.server.tsx, root.tsx)
echo [ ] 2. No .env file will be committed (check .gitignore)
echo [ ] 3. Dependencies installed (npm install)
echo [ ] 4. Build tested (npm run build)
echo [ ] 5. App runs locally (npm run dev)
echo [ ] 6. No API keys in code
echo [ ] 7. README updated with your info
echo.
echo ========================================
echo.
echo Ready to push? Run these commands:
echo   git init
echo   git add .
echo   git commit -m "Initial commit: Shopify Bundle App"
echo   git remote add origin YOUR_GITHUB_URL
echo   git push -u origin main
echo.
pause