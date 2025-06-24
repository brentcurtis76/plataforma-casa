#!/bin/bash

# Church Admin Development Script

echo "🏛️  Starting Church Admin Platform..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it with: npm install -g pnpm"
    exit 1
fi

# Navigate to project directory
cd "$(dirname "$0")/.."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Check if .env.local exists
if [ ! -f "apps/web/.env.local" ]; then
    echo "⚠️  Warning: apps/web/.env.local not found!"
    echo "   The Supabase credentials have been configured for you."
    echo ""
fi

echo "🚀 Starting development server on port 3001..."
echo "   Church website: http://localhost:3001/anglicanasanandre"
echo "   Admin panel: http://localhost:3001/dashboard"
echo ""

# Start the dev server
pnpm dev