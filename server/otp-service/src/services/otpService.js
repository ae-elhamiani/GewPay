const crypto = require('crypto');
const Redis = require('ioredis');
const config = require('../config');

class OtpService {
  constructor() {
    this.redis = new Redis({
      host: config.redisHost,
      port: config.redisPort
    });
  }

  async generateOtp(secretKey) {
    const trackedOtp = await this.redis.hgetall(`otp:${secretKey}`);
    const currentTime = Date.now();

    if (trackedOtp.generationTime) {
      const timeSinceLastGeneration = (currentTime - parseInt(trackedOtp.generationTime)) / 60000;
      
      if (timeSinceLastGeneration < config.retryWaitTimeMinutes) {
        if (parseInt(trackedOtp.generationCount) >= config.maxGenerationAttempts) {
          return null;
        }
      }
    }

    const counter = trackedOtp.counter ? parseInt(trackedOtp.counter) + 1 : 0;
    const otp = this.generateHOTP(secretKey, counter);

    await this.redis.hmset(`otp:${secretKey}`, {
      counter,
      generationTime: currentTime,
      generationCount: trackedOtp.generationCount ? parseInt(trackedOtp.generationCount) + 1 : 1,
      verificationAttempts: 0
    });
    await this.redis.expire(`otp:${secretKey}`, config.redisExpiry);

    return otp;
  }

  async verifyOtp(secretKey, userInput) {
    const trackedOtp = await this.redis.hgetall(`otp:${secretKey}`);
    
    if (!trackedOtp.generationTime) {
      return 'INVALID';
    }

    const currentTime = Date.now();
    const timeSinceGeneration = (currentTime - parseInt(trackedOtp.generationTime)) / 60000;

    if (timeSinceGeneration > config.expiryTimeMinutes) {
      return 'TIMEOUT';
    }

    if (parseInt(trackedOtp.verificationAttempts) >= config.maxGenerationAttempts) {
      return 'EXPIRED_ATTEMPT';
    }

    const isValid = this.generateHOTP(secretKey, parseInt(trackedOtp.counter)) === userInput;

    await this.redis.hincrby(`otp:${secretKey}`, 'verificationAttempts', 1);

    return isValid ? 'VALID' : 'INVALID';
  }

  generateHOTP(secretKey, counter) {
    const decodedSecret = Buffer.from(secretKey, 'base64');
    const buffer = Buffer.alloc(8);
    for (let i = 0; i < 8; i++) {
      buffer[7 - i] = counter & 0xff;
      counter = counter >> 8;
    }

    const hmac = crypto.createHmac(config.otpAlgorithm, decodedSecret);
    hmac.update(buffer);
    const hmacResult = hmac.digest();

    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const binary =
      ((hmacResult[offset] & 0x7f) << 24) |
      ((hmacResult[offset + 1] & 0xff) << 16) |
      ((hmacResult[offset + 2] & 0xff) << 8) |
      (hmacResult[offset + 3] & 0xff);

    const otp = binary % Math.pow(10, config.otpLength);
    return otp.toString().padStart(config.otpLength, '0');
  }
}

module.exports = new OtpService();
