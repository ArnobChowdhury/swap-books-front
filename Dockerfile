FROM node:14-alpine

WORKDIR /usr/src/app

RUN mkdir images
RUN yarn install

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY ./.next ./.next
COPY ./build ./build
COPY ./favicon.ico ./favicon.ico

CMD ["yarn", "start"]
