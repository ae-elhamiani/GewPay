const express = require('express');
const mongoose = require('mongoose');
const Consul = require('consul');
const config = require('./config');
const merchantRoutes = require('./routes/merchantRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swaggerConfig');

const app = express();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Merchant service is healthy' });
});

app.use('/', merchantRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(errorHandler);

mongoose.set('strictQuery', false);

async function startServer() {
  try {
    await mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const consulClient = new Consul({
      host: config.consulHost,
      port: config.consulPort,
      promisify: true
    });

    const PORT = parseInt(process.env.PORT || '5002', 10);
    const SERVICE_ID = `merchant-service-${process.env.HOSTNAME || 'local'}`;
    const SERVICE_ADDRESS = process.env.SERVICE_ADDRESS || 'merchant-service';

    app.listen(PORT, async () => {
      console.log(`Merchant service running on port ${PORT}`);
      try {
        await consulClient.agent.service.register({
          id: SERVICE_ID,
          name: 'merchant-service',
          address: SERVICE_ADDRESS,
          port: PORT,
          check: {
            http: `http://${SERVICE_ADDRESS}:${PORT}/health`,
            interval: '10s',
            timeout: '5s',
            deregistercriticalserviceafter: '1m'
          }
        });
        console.log('Merchant Service registered with Consul');
      } catch (err) {
        console.error('Merchant Service Failed to register with Consul:', err);
      }
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await consulClient.agent.service.deregister(SERVICE_ID);
        console.log('Merchant Service deregistered from Consul');
      } catch (err) {
        console.error('Failed to deregister Merchant Service from Consul:', err);
      }
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();