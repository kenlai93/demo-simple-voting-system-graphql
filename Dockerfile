FROM node:18-alpine

WORKDIR /workspace

COPY ./package*.json /workspace

RUN npm install

COPY . .

RUN npm run prisma:generate && npm run build

EXPOSE 3000

CMD npm run start:prod
