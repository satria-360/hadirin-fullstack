# Gunakan Node.js versi 20
FROM node:20-alpine

# Tentukan folder kerja di dalam kontainer
WORKDIR /app

# Copy file dependencies terlebih dahulu
COPY package*.json ./

# Install seluruh dependencies
RUN npm install

# Copy seluruh source code backend
COPY . .

# Expose port aplikasi
EXPOSE 5000

# Jalankan migrasi database lalu jalankan server
CMD ["sh", "-c", "npx knex migrate:latest && npm start"]