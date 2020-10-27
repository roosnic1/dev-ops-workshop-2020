FROM node:12.14.0-alpine

RUN apk update

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node ./package.json ./package.json
COPY --chown=node:node ./yarn.lock ./yarn.lock

COPY --chown=node:node ./src/ ./src/

RUN yarn install
EXPOSE 5000

CMD [ "node", "./src/index.js" ]
