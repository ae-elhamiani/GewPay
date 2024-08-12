const express = require('express');
const consul = require('consul');
const config = require('./config');
const { connectRedis } = require('./utils/redisClient');
const otpRoutes = require('./routes/otpRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swaggerConfig');

const app = express();

app.use(express.json());

// Connect to Redis and start server
async function startServer() {
  try {
    await connectRedis();

    app.use('/', otpRoutes);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
    app.use(errorHandler);

    const consulClient = new consul({
      host: config.consulHost,
      port: config.consulPort,
      promisify: true
    });

    const PORT = parseInt(process.env.PORT || '5004', 10);

    app.listen(PORT, async () => {
      console.log(`OTP service running on port ${PORT}`);
      try {
        await consulClient.agent.service.register({
          name: 'otp-service',
          address: process.env.SERVICE_ADDRESS || 'otp-service',
          port: PORT,
          check: {
            http: `http://${process.env.SERVICE_ADDRESS || 'otp-service'}:${PORT}/health`,
            interval: '10s'
          }
        });
        console.log('OTP Service registered with Consul');
      } catch (err) {
        console.error('OTP Service Failed to register with Consul:', err);
      }
    });

    app.get('/health', (req, res) => res.status(200).send('OK'));

    // Graceful shutdown
    process.on('SIGINT', async () => {
      const client = getRedisClient();
      await client.quit();
      process.exit(0);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();