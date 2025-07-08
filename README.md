# Система генерации документов кооператива

Монорепозиторий для автоматизации создания документов кооператива с использованием DOCX шаблонов.

## Структура проекта

```
├── apps/
│   ├── frontend/          # Next.js веб-интерфейс
│   └── backend/           # Express.js API
├── packages/
│   └── shared/            # Общие типы и утилиты
├── data/                  # DOCX шаблоны
└── temp/                  # Временные файлы генерации
```

## Установка и запуск

### Предварительные требования
- Node.js 18+
- pnpm (рекомендуется)

### Установка зависимостей
```bash
pnpm install
```

### Запуск в режиме разработки
```bash
# Запуск всех приложений
pnpm dev

# Запуск только backend
pnpm dev:backend

# Запуск только frontend
pnpm dev:frontend
```

### Сборка
```bash
# Сборка всех пакетов
pnpm build

# Сборка отдельных пакетов
pnpm build:shared
pnpm build:backend
pnpm build:frontend
```

## Использование

### Режимы работы

1. **Пакет подключения** - генерация 8 документов для подключения к кооперативу
2. **Новый кооператив** - генерация Устава и Протокола №1 для создания нового кооператива

### API Endpoints

- `POST /api/cooperative/connection-package` - Генерация пакета подключения
- `POST /api/cooperative/new-cooperative` - Генерация документов нового кооператива
- `GET /api/download/:folderName` - Скачивание сгенерированных документов

### Веб-интерфейс

Доступен по адресу `http://localhost:3001` после запуска frontend.

## Разработка

### Добавление новых типов
Общие типы добавляются в `packages/shared/src/document.types.ts`

### Добавление новых утилит
Общие утилиты добавляются в `packages/shared/src/utils.ts`

### Обновление шаблонов
DOCX шаблоны находятся в папке `data/`

## Технологии

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Генерация**: docxtemplater, pizzip, libreoffice-convert
- **Монорепозиторий**: pnpm workspaces

## Лицензия

ISC
