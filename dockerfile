FROM node:22-alpine

WORKDIR /app

# faqat kerakli fayllarni olib kelamiz (layer cache uchun)
COPY package*.json ./
RUN npm install --only=production

# Prisma fayllarini olib kelamiz
COPY prisma ./prisma

# Qolgan kodlarni ko'chiramiz
COPY . .

# Build qilish
RUN npm run build

# Port ochamiz
EXPOSE 3000

CMD sh -c "npx prisma migrate deploy && npm run start:prod"
