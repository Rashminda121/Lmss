FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules

RUN npm cache clean --force

RUN npm install

RUN npx prisma generate

COPY . .

COPY .env .env

EXPOSE 3000

CMD ["npm", "run", "dev"]

