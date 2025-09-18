FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY prisma ./prisma
COPY . .

# NestJS build
RUN npm run build

# Prisma migrate (prod mode)
RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
