const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const consul = require('consul');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swaggerConfig');
const cors = require('cors');

const { ApolloServer } = require('apollo-server-express');
const { PaymentError } = require('./middleware/customErrors');
const { authMiddleware } = require('./middleware/auth');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();

require('dotenv').config();

app.use(cors()); // Enable CORS for all routes
app.use(authMiddleware);
app.use(helmet());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(errorHandler);

const consulClient = new consul({
  host: config.consulHost,
  port: config.consulPort,
  promisify: true,
});


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Add the authenticated user to the context
    return { user: req.user };
  },
  formatError: (err) => {
    if (err.originalError instanceof PaymentError) {
      return {
        message: err.message,
        code: err.originalError.code,
      };
    }
    // For other errors, return a generic error message
    return {
      message: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR',
    };
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]

});


const startServer = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    app.listen(config.port, async () => {
      console.log(`Payment service running on port ${config.port}`);
      try {
        await consulClient.agent.service.register({
          name: 'payment-service',
          address: config.serviceAddress,
          port: config.port,
          check: {
            http: `http://${config.serviceAddress}:${config.port}/health`,
            interval: '10s',
          },
        });
        console.log('Payment Service registered with Consul');
      } catch (err) {
        console.error('Failed to register with Consul:', err);
      }
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

app.get('/health', (req, res) => res.status(200).send('OK'));

startServer();
