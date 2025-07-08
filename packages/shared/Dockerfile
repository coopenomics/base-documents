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

# Копируем package.json для shared
COPY packages/shared/package.json ./packages/shared/

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем исходный код
COPY packages/shared ./packages/shared

# Переходим в директорию shared
WORKDIR /app/packages/shared

# Собираем shared пакет
RUN pnpm run build

# Создаем финальный образ
FROM node:18-alpine AS production

WORKDIR /app

# Копируем собранные файлы
COPY --from=base /app/packages/shared/dist ./dist
COPY --from=base /app/packages/shared/package.json ./

# Эта служба используется только для сборки shared пакета
# Она не запускает сервер, а только предоставляет скомпилированные файлы
CMD ["echo", "Shared package built successfully"] 