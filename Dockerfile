FROM node:18-alpine

WORKDIR /workspace

COPY ./package*.json /workspace

RUN npm install

COPY ./src ./src
COPY ./prisma ./prisma
COPY ./tsconfig*.json ./

RUN npm run prisma:generate && npm run build

EXPOSE 3000

CMD npm run start
