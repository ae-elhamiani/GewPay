const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const storeRoutes = require('./routes/storeRoutes');
const errorHandler = require('./middleware/errorHandler');
const consulClient = require('./services/consulClient');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swaggerConfig');
// const Token = require('./models/Token'); //!!!!

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
//!!!
// const mockTokens = [
//   { symbol: 'ETH', name: 'Ethereum', addressToken: '0x1234567890123456789012345678901234567810', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', chainId: 1, decimals: 18 },
//   { symbol: 'USDT', name: 'Tether', addressToken: '0x2345678901234567890123456789012345678911', logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png', chainId: 1, decimals: 6 },
//   { symbol: 'USDC', name: 'USD Coin', addressToken: '0x3456789012345678901234567890123456789022', logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', chainId: 1, decimals: 6 },
//   { symbol: 'BNB', name: 'Binance Coin', addressToken: '0x4567890123456789012345678901234567890133', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', chainId: 56, decimals: 18 },
// ];

// async function seedTokens() {
//   for (const tokenData of mockTokens) {
//     try {
//       const existingToken = await Token.findOne({ symbol: tokenData.symbol, chainId: tokenData.chainId });
//       if (existingToken) {
//         console.log(`Token ${tokenData.symbol} already exists. Skipping...`);
//       } else {
//         console.log(`Creating new token: ${tokenData.symbol}`);
//         await Token.create(tokenData);
//       }
//     } catch (error) {
//       console.error(`Error processing token ${tokenData.symbol}:`, error);
//     }
//   }
//   console.log('Token seeding completed');
// }
//!!!
async function startServer() {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('Connected to MongoDB');

    await removeConflictingIndex();
    // await seedTokens(); //!!!

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