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
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем исходный код
COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend

# Создаем директорию public если её нет
RUN mkdir -p /app/apps/frontend/public

# Собираем shared пакет
RUN pnpm run --filter=@coop/shared build

# Собираем frontend
ENV NODE_ENV=production
RUN pnpm run --filter=@coop/frontend build

# Создаем production образ
FROM node:18-alpine AS production

# Устанавливаем pnpm
RUN npm install -g pnpm

WORKDIR /app

# Копируем только production зависимости
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Устанавливаем только production зависимости
RUN pnpm install --prod --frozen-lockfile

# Копируем собранные файлы
COPY --from=base /app/packages/shared/dist ./packages/shared/dist
COPY --from=base /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=base /app/apps/frontend/next.config.js ./apps/frontend/
COPY --from=base /app/apps/frontend/package.json ./apps/frontend/

# Создаем директорию public в production образе
RUN mkdir -p /app/apps/frontend/public

# Копируем public директорию если она существует
COPY --from=base /app/apps/frontend/public ./apps/frontend/public

# Переходим в директорию frontend
WORKDIR /app/apps/frontend

# Открываем порт
EXPOSE 3001

# Запускаем приложение
CMD ["pnpm", "start"] 