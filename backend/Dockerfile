# ──────────────────────────────────────────
# Stage 1: Install dependencies & build
# ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies dulu (layer cache)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy seluruh source code backend
COPY . .

# ──────────────────────────────────────────
# Stage 2: Production image
# ──────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copy hanya yang diperlukan dari builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Expose port backend
EXPOSE 5000

# Jalankan migrasi lalu start server
CMD ["sh", "-c", "npx knex migrate:latest && npx knex seed:run && node index.js"]
