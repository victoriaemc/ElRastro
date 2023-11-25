FROM node

WORKDIR /index

COPY  package.json .

RUN npm install

COPY . .

EXPOSE 8002

CMD ["npm", "start"]

LABEL authors="vicky"