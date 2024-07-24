const redis = require('redis');
const config = require('../config');

const client = redis.createClient({
  url: `redis://${config.redisHost}:${config.redisPort}`
});

client.on('error', (err) => {
  console.log('Redis Client Error', err);
});

module.exports = client;