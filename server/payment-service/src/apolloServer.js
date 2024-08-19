// src/apolloServer.js
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const PaymentOrderAPI = require('./datasources/PaymentOrderAPI');

async function createApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      paymentOrderAPI: new PaymentOrderAPI(),
    }),
  });

  await server.start();

  return server;
}

module.exports = createApolloServer;