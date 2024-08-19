FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install apollo-server-express express graphql mongoose apollo-server-core

COPY . .

EXPOSE 5006

CMD ["npm", "start"]