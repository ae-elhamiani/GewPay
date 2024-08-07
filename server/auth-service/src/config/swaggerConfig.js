const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication Service API',
      version: '1.0.0',
      description: 'API documentation for the Authentication Service',
    },
  },
  apis: ['./src/routes/*.js'], 
};

module.exports = swaggerJsdoc(options);