const speakeasy = require('speakeasy');

function generateOTP(secret) {
    return speakeasy.totp({
        secret: secret,
        encoding: 'base32',
        digits: 6,
        step: 300 // Token is valid for 5 minutes
    });
}

module.exports = generateOTP;
