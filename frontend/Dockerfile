# ==========================================
# Stage 1: Build Frontend Assets (Vue 3 + Vite)
# Versi spesifik Node.js (Alpine)
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Salin package manifest untuk optimasi caching dependencies
COPY package.json package-lock.json ./

# Install dependensi frontend
RUN npm ci

# Salin source code
COPY . .

# Argument & Environment variable untuk API base URL saat build (reverse proxy /api)
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Jalankan build Vue ke folder dist
RUN npm run build

# ==========================================
# Stage 2: Production Nginx Server
# Versi spesifik Nginx (Alpine) - Tanpa node_modules
# ==========================================
FROM nginx:1.27-alpine AS production

# Salin konfigurasi Nginx reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin file statis hasil build dari stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
