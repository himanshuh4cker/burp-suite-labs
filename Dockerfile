FROM node:24-alpine

# Install build tools in case native dependencies are ever needed, though node:sqlite is native
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "node", "server.js" ]
