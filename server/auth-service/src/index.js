const express = require('express');
const consul = require('consul');
const config = require('./config');
const redisClient = require('./utils/redisClient');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swaggerConfig');

const app = express();

app.use(express.json());

// Connect to Redis
async function startServer() {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');

    app.use('/', authRoutes);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
    app.use(errorHandler);

    const consulClient = new consul({
      host: config.consulHost,
      port: config.consulPort,
      promisify: true
    });

    const PORT = parseInt(process.env.PORT || '5010', 10);

    app.listen(PORT, async () => {
      console.log(`Auth service running on port ${PORT}`);
        try {
          await consulClient.agent.service.register({
            name: 'auth-service',
            address: process.env.SERVICE_ADDRESS || 'auth-service',
            port: PORT,
            check: {
              http: `http://${process.env.SERVICE_ADDRESS || 'auth-service'}:${PORT}/health`,
              interval: '10s'
            }
          });
          console.log('Auth Service registered with Consul');
        } catch (err) {
          console.error('Auth Service Failed to register with Consul:', err);
        }
    });

    app.get('/health', (req, res) => res.status(200).send('OK'));

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await redisClient.quit();
      process.exit(0);
    });
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    process.exit(1);
  }
}

startServer();