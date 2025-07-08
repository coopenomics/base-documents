#!/bin/bash

# Останавливаем скрипт при первой ошибке и при использовании неопределенных переменных
set -e
set -u

# Функция для вывода ошибок
error_exit() {
    echo "❌ Ошибка: $1" >&2
    exit 1
}

echo "🛑 Остановка системы генерации документов кооператива..."

# Проверяем наличие Docker Compose
if ! command -v docker-compose &> /dev/null; then
    error_exit "Docker Compose не установлен."
fi

# Останавливаем контейнеры
echo "🔄 Остановка контейнеров..."
if ! docker-compose down; then
    error_exit "Не удалось остановить контейнеры"
fi

echo "📊 Статус после остановки:"
docker-compose ps

echo ""
echo "✅ Система остановлена!"
echo ""
echo "Для запуска используйте: ./start.sh" 