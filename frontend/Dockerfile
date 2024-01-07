FROM node

RUN npm install -g nodemon

WORKDIR /index

COPY  package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

LABEL authors="vicky"