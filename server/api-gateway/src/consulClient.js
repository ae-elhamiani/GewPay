const consul = require('consul');
const config = require('./config');

const consulClient = new consul({
  host: process.env.CONSUL_HOST || 'consul',
  port: process.env.CONSUL_PORT || 8500,
  promisify: true
});

module.exports = consulClient;