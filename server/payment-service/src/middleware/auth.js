const jwt = require('jsonwebtoken');
const config = require('../config');

function authMiddleware(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('Authorization header must be provided');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Authentication token must be provided');
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  } catch (error) {
    throw new Error('Invalid/Expired token');
  }
}

module.exports = { authMiddleware };