# ──────────────────────────────────────────
# Stage 1: Build React + Vite app
# ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies dulu (layer cache)
COPY package*.json ./
RUN npm ci

# Build arg untuk API URL (di-inject saat docker-compose build)
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

# Copy seluruh source code frontend
COPY . .

# Build production bundle
RUN npm run build


# ──────────────────────────────────────────
# Stage 2: Serve dengan Nginx
# ──────────────────────────────────────────
FROM nginx:alpine AS production

# Hapus default config Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build dari stage 1 ke folder Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3040

CMD ["nginx", "-g", "daemon off;"]
