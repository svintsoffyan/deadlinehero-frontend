# -----------------------------
# 1) Builder
# -----------------------------
FROM node:20-alpine AS builder

# Опционально: избавляемся от ошибок glibc-зависимостей некоторых пакетов
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production \
    NUXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Ускоряем установку, используя кеш слоёв
COPY package*.json ./
# Если у тебя есть lock-файл: package-lock.json — он уже учтён;
# если используешь pnpm/yarn — поменяй команду ниже
RUN npm ci

# Копируем остальной код
COPY . .

# Собираем Nuxt (Nitro) — результат в .output/
RUN npm run build

# -----------------------------
# 2) Runner
# -----------------------------
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production \
    NUXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOST=0.0.0.0

WORKDIR /app

# Берём только то, что нужно для запуска
COPY --from=builder /app/.output ./.output
# Если есть публичные статические файлы вне .output/public — добавь копирование сюда

# Не запускаем от root (безопаснее)
RUN addgroup -S nodejs && adduser -S node -G nodejs
USER node

EXPOSE 3000

# Стартуем Nitro-сервер
CMD ["node", ".output/server/index.mjs"]