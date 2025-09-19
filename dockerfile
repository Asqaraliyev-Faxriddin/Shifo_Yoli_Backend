# Faqat build paytida devDependencies ham kerak bo‘ladi
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install  # bu yerda devDependencies ham o‘rnatiladi

COPY . .
RUN npm run build
RUN npx prisma migrate dev --name init

FROM node:22-alpine AS prod

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000
CMD ["npm", "run", "start:prod"]
