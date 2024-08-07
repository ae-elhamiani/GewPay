require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5002,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  consulHost: process.env.CONSUL_HOST,
  consulPort: process.env.CONSUL_PORT,
  serviceAddress: process.env.SERVICE_ADDRESS || 'merchant-service'
};