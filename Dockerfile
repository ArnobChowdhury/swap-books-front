FROM node:14-buster

WORKDIR /usr/src/app

RUN mkdir images

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY ./.next ./.next
COPY ./build ./build
COPY ./public ./public
COPY ./nsfwModels ./nsfwModels

CMD ["yarn", "start"]
