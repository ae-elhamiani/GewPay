const express = require('express');
const mongoose = require('mongoose');
const consul = require('consul');
const config = require('./config');
const merchantRoutes = require('./routes/merchantRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use('/api/merchants', merchantRoutes);
app.use(errorHandler);
mongoose.set('strictQuery', false);

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

  const consulClient = new consul({
    host: config.consulHost,
    port: config.consulPort,
    promisify: true
  });

  const PORT = parseInt(process.env.PORT || '5002', 10);

  app.listen(PORT, async () => {
    console.log(`Merchant service running on port ${PORT}`);
    setTimeout(async () => {
    try {
      await consulClient.agent.service.register({
        name: 'merchant-service',
        address: process.env.SERVICE_ADDRESS || 'merchant-service',
        port: PORT,
        check: {
          http: `http://${process.env.SERVICE_ADDRESS || 'merchant-service'}:${PORT}/health`,
          interval: '10s'
        }
      });
      console.log('Merchant Service registered with Consul');
    } catch (err) {
      console.error('Merchant Service Failed to register with Consul:', err);
    }
}, 15000); // 15 seconds delay

  });
app.get('/health', (req, res) => res.status(200).send('OK'));