FROM node:14-alpine

WORKDIR /usr/src/app

RUN mkdir images

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY ./.next ./.next
COPY ./build ./build
COPY ./favicon.ico ./favicon.ico
COPY ./pustokio_logo.png ./pustokio_logo.png

CMD ["yarn", "start"]
