require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5006,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  consulHost: process.env.CONSUL_HOST,
  consulPort: process.env.CONSUL_PORT,
  serviceAddress: process.env.SERVICE_ADDRESS || 'payment-service',
  woocommerceUrl: process.env.WOOCOMMERCE_URL,
  woocommerceConsumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
  woocommerceConsumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
};