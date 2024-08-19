const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const consulClient = require('./services/consulClient');  // Ensure the path is correct
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swaggerConfig');
const cors = require('cors');
const createApolloServer = require('./apolloServer'); // Import the Apollo Server setup
const orderRoutes = require('./routes/orderRoutes'); // Import the order routes

require('dotenv').config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/api', orderRoutes); // Use the order routes under /api


// Health Check Endpoint for Consul
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', message: 'Payment service is healthy' }));

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('Connected to MongoDB');

    const apolloServer = await createApolloServer(); // Use the separated Apollo Server setup
    apolloServer.applyMiddleware({ app });
    app.use(errorHandler);

    const PORT = parseInt(config.port, 10);
    const SERVICE_ID = `payment-service-${process.env.HOSTNAME || 'local'}`;

    app.listen(PORT, async () => {
      console.log(`Payment service running on port ${PORT}`);
      console.log(`GraphQL endpoint available at http://localhost:${PORT}${apolloServer.graphqlPath}`);
      try {
        await consulClient.agent.service.register({
          id: SERVICE_ID,
          name: 'payment-service',
          address: config.serviceAddress,
          port: PORT,
          check: {
            http: `http://${config.serviceAddress}:${PORT}/health`,
            interval: '10s',
            timeout: '5s',
            deregistercriticalserviceafter: '1m'
          }
        });
        console.log('Payment Service registered with Consul');
      } catch (err) {
        console.error('Failed to register with Consul:', err);
      }
    });

    process.on('SIGINT', async () => {
      try {
        await consulClient.agent.service.deregister(SERVICE_ID);
        console.log('Payment Service deregistered from Consul');
      } catch (err) {
        console.error('Failed to deregister Payment Service from Consul:', err);
      }
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
