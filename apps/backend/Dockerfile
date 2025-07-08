# Используем Node.js 18 LTS
FROM node:18-alpine AS base

# Устанавливаем pnpm
RUN npm install -g pnpm

# Рабочая директория
WORKDIR /app

# Копируем конфигурационные файлы
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем корневой tsconfig.json (нужен для extends в shared/tsconfig.json)
COPY tsconfig.json ./

# Копируем все package.json файлы
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем исходный код
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Собираем shared пакет
RUN pnpm run --filter=@coop/shared build

# Собираем backend
RUN pnpm run --filter=@coop/backend build

# Создаем production образ
FROM node:18-alpine AS production

# Устанавливаем LibreOffice для конвертации в PDF
RUN apk add --no-cache libreoffice

# Устанавливаем pnpm
RUN npm install -g pnpm

WORKDIR /app

# Копируем только production зависимости
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Устанавливаем только production зависимости
RUN pnpm install --prod --frozen-lockfile

# Копируем собранные файлы
COPY --from=base /app/packages/shared/dist ./packages/shared/dist
COPY --from=base /app/apps/backend/dist ./apps/backend/dist

# Копируем необходимые файлы
COPY apps/backend/data ./apps/backend/data

# Создаем директории для temp файлов
RUN mkdir -p /app/temp /app/public

# Устанавливаем права
RUN chmod 755 /app/temp /app/public

# Переходим в директорию backend
WORKDIR /app/apps/backend

# Открываем порт
EXPOSE 3542

# Запускаем приложение
CMD ["node", "dist/index.js"] 