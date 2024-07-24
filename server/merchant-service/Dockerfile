FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
ENV CONSUL_HOST=consul
ENV CONSUL_PORT=8500
EXPOSE 5002
CMD ["npm", "start"]