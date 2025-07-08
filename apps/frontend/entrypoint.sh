#!/bin/sh

# Создаем .env файл из переменных окружения
echo "🔧 Создание .env файла из переменных окружения..."

cat > .env <<EOF
NODE_ENV=${NODE_ENV:-production}
API_URL=${API_URL:-http://localhost:3542}
SHOW_TEST_BUTTON=${SHOW_TEST_BUTTON:-false}
DOMAIN=${DOMAIN:-localhost}
BACKEND_PORT=${BACKEND_PORT:-3542}
FRONTEND_PORT=${FRONTEND_PORT:-3001}
EOF

echo "✅ .env файл создан:"
cat .env

echo "🚀 Запуск Next.js приложения..."
exec pnpm start 