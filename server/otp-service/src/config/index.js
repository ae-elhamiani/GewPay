const config = {
    otpLength: 6,
    otpAlgorithm: 'sha256',
    expiryTimeMinutes: 5,
    maxGenerationAttempts: 3,
    retryWaitTimeMinutes: 15,
    consulHost: process.env.CONSUL_HOST || 'consul',  // Updated to use service name
    consulPort: process.env.CONSUL_PORT || 8500,
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.REDIS_PORT || 6379,
    redisExpiry: 7200 // 2 hours in seconds
  };
  module.exports = config;