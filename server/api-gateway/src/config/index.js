require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  consulHost: process.env.CONSUL_HOST || 'consul',
  consulPort: process.env.CONSUL_PORT || 8500,
  authServiceName: 'auth-service',
  merchantServiceName: 'merchant-service',
  notifServiceName: 'notif-service',
  otpServiceName: 'otp-service',
  storeServiceName: 'store-service'

};