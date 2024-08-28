require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5007,
  serviceAddress: process.env.SERVICE_ADDRESS || 'localhost',
  mongoURI: process.env.MONGODB_URI,
  consulHost: process.env.CONSUL_HOST,
  consulPort: process.env.CONSUL_PORT || 8500
};