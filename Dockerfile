FROM node:24-alpine3.21
WORKDIR /app

# Package fayllarini copy qilish
COPY package*.json ./

# BARCHA dependencies o'rnatish (dev + prod)
RUN npm install

# Barcha kodlarni copy qilish
COPY . .

# Build qilish
RUN npm run build

# Production dependencies o'rnatish (build dan keyin)
RUN npm ci --only=production && npm cache clean --force

# Port ochish
EXPOSE 3000

# Health check qo'shish
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Ishga tushirish
CMD ["npm", "run", "start:prod"]