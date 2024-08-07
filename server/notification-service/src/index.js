const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const consul = require('consul');
const config = require('./config');
require('dotenv').config();
const routes = require('./routes/notificationRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swaggerConfig');

const app = express();

app.use(helmet());
app.use(express.json());

app.use('/', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(errorHandler);

const consulClient = new consul({
  host: config.consulHost,
  port: config.consulPort,
  promisify: true
});

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    app.listen(config.port, async () => {
      console.log(`Notification service running on port ${config.port}`);
      try {
        await consulClient.agent.service.register({
          name: 'notification-service',
          address: process.env.SERVICE_ADDRESS || 'notification-service',
          port: config.port,
          check: {
            http: `http://${process.env.SERVICE_ADDRESS || 'notification-service'}:${config.port}/health`,
            interval: '10s'
          }
        });
        console.log('Notification Service registered with Consul');
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