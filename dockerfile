FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY prisma ./prisma
COPY . .

# Build NestJS
RUN npm run build

# Prisma migration optional
# RUN npx prisma migrate deploy

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
