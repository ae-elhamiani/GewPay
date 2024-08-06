const Redis = require('ioredis');
const config = require('../config');

let redisClient;

function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis({
      host: config.redisHost,
      port: config.redisPort,
      lazyConnect: true  // This prevents automatic connection on client creation
    });
  }
  return redisClient;
}

async function connectRedis() {
  const client = getRedisClient();
  if (client.status === 'ready') {
    console.log('Redis is already connected');
    return client;
  }
  try {
    await client.connect();
    console.log('Connected to Redis');
    return client;
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    throw err;
  }
}

module.exports = {
  getRedisClient,
  connectRedis
};