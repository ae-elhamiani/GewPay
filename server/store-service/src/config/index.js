require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5005,
  mongoURI: process.env.MONGO_URI,
  consulHost: process.env.CONSUL_HOST,
  consulPort: process.env.CONSUL_PORT,
  serviceAddress: process.env.SERVICE_ADDRESS || 'store-service'
};