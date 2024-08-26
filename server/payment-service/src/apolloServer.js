// src/apolloServer.js
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const PaymentSessionAPI = require('./datasources/PaymentSessionAPI');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

async function createApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      paymentSessionAPI: new PaymentSessionAPI(),
    }),
  });

  await server.start();

  return server;
}

module.exports = createApolloServer;
