FROM node:14-alpine as builder

ARG ENV
ARG PORT

WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . ./


RUN yarn build
RUN yarn global add serve
WORKDIR /app/build
#Start the application
CMD serve -p $PORT -s . 