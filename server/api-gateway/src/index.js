const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const consulClient = require('./consulClient');


const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);


const PORT = parseInt(process.env.PORT || '4000', 10);

const startServer = async () => {
  console.log('Waiting for services to register with Consul...');
  await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds

  app.listen(PORT, async () => {
    console.log(`API Gateway running on port ${PORT}`);
    try {
      await consulClient.agent.service.register({
        name: 'api-gateway',
        address: process.env.SERVICE_ADDRESS || 'api-gateway',
        port: PORT,
        check: {
          http: `http://${process.env.SERVICE_ADDRESS || 'api-gateway'}:${PORT}/health`,
          interval: '10s'
        }
      });
      console.log('API Gateway registered with Consul');
    } catch (err) {
      console.error('Failed to register with Consul:', err);
    }
  });
};

app.get('/health', (req, res) => res.status(200).send('OK'));

startServer();