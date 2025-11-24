# PowerShell setup script for Windows

Write-Host "🚀 Setting up UZA Empower Backend..." -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js v18 or higher." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  Please edit .env and configure your database and secrets." -ForegroundColor Yellow
}

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate

# Run migrations
Write-Host "🗄️  Database migrations..." -ForegroundColor Yellow
$response = Read-Host "Have you configured your DATABASE_URL in .env? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    npm run prisma:migrate
} else {
    Write-Host "⚠️  Skipping migrations. Run 'npm run prisma:migrate' after configuring DATABASE_URL." -ForegroundColor Yellow
}

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env and configure your database connection"
Write-Host "2. Run 'npm run prisma:migrate' to set up the database"
Write-Host "3. Run 'npm run dev' to start the development server"

