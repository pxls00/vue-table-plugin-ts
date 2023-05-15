FROM node:18.15.0-alpine

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn

COPY . ./

EXPOSE 8080

CMD [ "yarn", "preview" ]