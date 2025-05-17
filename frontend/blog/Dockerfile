FROM node:18-slim

WORKDIR /front

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start"]