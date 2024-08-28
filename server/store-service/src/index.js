const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const storeRoutes = require('./routes/storeRoutes');
const errorHandler = require('./middleware/errorHandler');
const consulClient = require('./services/consulClient');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swaggerConfig');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Store service is healthy' });
});

app.use('/', storeRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(errorHandler);

mongoose.set('strictQuery', false);

const removeConflictingIndex = async () => {
  try {
    const Store = mongoose.model('Store');
    await Store.collection.dropIndex('id_1');
    console.log('Successfully removed conflicting index');
  } catch (error) {
    if (error.code === 27) {
      console.log('Index does not exist, no need to remove');
    } else {
      console.error('Error removing conflicting index:', error);
    }
  }
};
async function startServer() {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('Connected to MongoDB');

    await removeConflictingIndex();

    const PORT = parseInt(config.port, 10);
    const SERVICE_ID = `store-service-${process.env.HOSTNAME || 'local'}`;

    app.listen(PORT, async () => {
      console.log(`Store service running on port ${PORT}`);
      try {
        await consulClient.agent.service.register({
          id: SERVICE_ID,
          name: 'store-service',
          address: config.serviceAddress,
          port: PORT,
          check: {
            http: `http://${config.serviceAddress}:${PORT}/health`,
            interval: '10s',
            timeout: '5s',
            deregistercriticalserviceafter: '1m'
          }
        });
        console.log('Store Service registered with Consul');
      } catch (err) {
        console.error('Store Service Failed to register with Consul:', err);
      }
    });

    process.on('SIGINT', async () => {
      try {
        await consulClient.agent.service.deregister(SERVICE_ID);
        console.log('Store Service deregistered from Consul');
      } catch (err) {
        console.error('Failed to deregister Store Service from Consul:', err);
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