const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const kycRoutes = require('./routes/kycRoutes');
const errorHandler = require('./middleware/errorHandler');
const consulClient = require('./services/consulClient');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swaggerConfig');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'KYC service is healthy' });
});

app.use('/kyc', kycRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(errorHandler);

mongoose.set('strictQuery', false);

async function startServer() {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('Connected to MongoDB');

    const PORT = parseInt(config.port, 10);
    const SERVICE_ID = `kyc-service-${process.env.HOSTNAME || 'local'}`;

    app.listen(PORT, async () => {
      console.log(`KYC service running on port ${PORT}`);
      try {
        await consulClient.agent.service.register({
          id: SERVICE_ID,
          name: 'kyc-service',
          address: config.serviceAddress,
          port: PORT,
          check: {
            http: `http://${config.serviceAddress}:${PORT}/health`,
            interval: '10s',
            timeout: '5s',
            deregistercriticalserviceafter: '1m'
          }
        });
        console.log('KYC Service registered with Consul');
      } catch (err) {
        console.error('KYC Service Failed to register with Consul:', err);
      }
    });

    process.on('SIGINT', async () => {
      try {
        await consulClient.agent.service.deregister(SERVICE_ID);
        console.log('KYC Service deregistered from Consul');
      } catch (err) {
        console.error('Failed to deregister KYC Service from Consul:', err);
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