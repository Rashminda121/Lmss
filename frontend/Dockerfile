FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

COPY .env .env

COPY prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "dev"]


