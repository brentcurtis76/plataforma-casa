#!/bin/bash
# Script to restore full monorepo structure

echo "🔧 Restoring monorepo imports..."

# Update UI imports
find apps/web -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|from "@/lib/ui|from "@church-admin/ui|g'

# Update schema imports
find apps/web -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|from "@/lib/schemas/auth"|from "@church-admin/shared"|g'

# Remove duplicate UI components from web app
echo "🗑️  Removing duplicate UI components..."
rm -rf apps/web/lib/ui

# Remove duplicate auth schemas from web app
echo "🗑️  Removing duplicate auth schemas..."
rm -rf apps/web/lib/schemas

echo "✅ Monorepo structure restored!"
echo "📦 Running pnpm install to update dependencies..."
pnpm install

echo "🎉 Done! The full monorepo architecture is restored."