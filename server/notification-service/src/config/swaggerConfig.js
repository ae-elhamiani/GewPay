const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notification Service API',
      version: '1.0.0',
      description: 'API documentation for the Notification Service',
    },
  },
  apis: ['./src/routes/*.js'], 
};

module.exports = swaggerJsdoc(options);