#!/bin/bash

# Останавливаем скрипт при первой ошибке и при использовании неопределенных переменных
set -e
set -u

# Функция для вывода ошибок
error_exit() {
    echo "❌ Ошибка: $1" >&2
    exit 1
}

echo "🚀 Запуск системы генерации документов кооператива..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    error_exit "Docker не установлен. Установите Docker и попробуйте снова."
fi

# Проверяем наличие Docker Compose
if ! command -v docker-compose &> /dev/null; then
    error_exit "Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
fi

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден!"
    echo "📝 Создайте файл .env на основе env.example:"
    echo "   cp env.example .env"
    echo "   nano .env"
    echo ""
    echo "📋 Измените в .env файле:"
    echo "   DOMAIN=your-domain.com -> DOMAIN=ваш-домен.com"
    echo "   NEXT_PUBLIC_API_URL=https://your-domain.com -> NEXT_PUBLIC_API_URL=https://ваш-домен.com"
    echo ""
    read -p "Создать .env файл автоматически? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp env.example .env || error_exit "Не удалось создать .env файл"
        echo "✅ Файл .env создан. Отредактируйте его перед запуском."
        echo "   nano .env"
        exit 0
    else
        exit 1
    fi
fi

# Собираем и запускаем контейнеры
echo "🔨 Сборка образов..."
if ! docker-compose build; then
    error_exit "Не удалось собрать Docker образы"
fi

echo "🚀 Запуск контейнеров..."
if ! docker-compose up -d; then
    error_exit "Не удалось запустить контейнеры"
fi

# Ждем немного чтобы сервисы запустились
echo "⏳ Ожидание запуска сервисов..."
sleep 10

# Проверяем статус
echo "📊 Статус сервисов:"
docker-compose ps

# Читаем переменные из .env файла
if [ -f .env ]; then
    source .env
fi

echo ""
echo "✅ Система запущена!"
echo "🌐 Frontend: http://localhost:${FRONTEND_PORT:-3001}"
echo "🔧 Backend API: http://localhost:${BACKEND_PORT:-3542}/api/health"
echo "🌍 Production URL: ${NEXT_PUBLIC_API_URL:-https://your-domain.com}"
echo ""
echo "Для остановки используйте: ./stop.sh"
echo "Для просмотра логов: docker-compose logs -f" 