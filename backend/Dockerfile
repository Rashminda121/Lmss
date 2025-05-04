FROM node:20 

WORKDIR /usr/src/app/backend

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

EXPOSE 4000

CMD ["npm", "run", "dev"]
