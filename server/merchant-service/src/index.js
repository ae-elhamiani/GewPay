const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const merchantRoutes = require('./routes/merchantRoutes');
const errorHandler = require('./middleware/errorHandler');
const consulClient = require('./services/consulClient');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Merchant service is healthy' });
});

app.use('/', merchantRoutes);
app.use(errorHandler);

mongoose.set('strictQuery', false);

async function startServer() {
  try {
    await mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const PORT = parseInt(config.port, 10);
    const SERVICE_ID = `merchant-service-${process.env.HOSTNAME || 'local'}`;

    app.listen(PORT, async () => {
      console.log(`Merchant service running on port ${PORT}`);
      try {
        await consulClient.agent.service.register({
          id: SERVICE_ID,
          name: 'merchant-service',
          address: config.serviceAddress,
          port: PORT,
          check: {
            http: `http://${config.serviceAddress}:${PORT}/health`,
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
