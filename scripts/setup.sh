#!/bin/bash

echo "🚀 Setting up UZA Empower Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL v12 or higher."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env and configure your database and secrets."
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate

# Run migrations
echo "🗄️  Running database migrations..."
read -p "Have you configured your DATABASE_URL in .env? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run prisma:migrate
else
    echo "⚠️  Skipping migrations. Run 'npm run prisma:migrate' after configuring DATABASE_URL."
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and configure your database connection"
echo "2. Run 'npm run prisma:migrate' to set up the database"
echo "3. Run 'npm run dev' to start the development server"

