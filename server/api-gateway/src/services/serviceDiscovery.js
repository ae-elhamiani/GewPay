const consul = require('consul');
const config = require('../config');
const consulClient = require('./consulClient');


const getService = async (serviceName) => {
  console.log(`Attempting to discover ${serviceName}`);
  try {
    const result = await consulClient.catalog.service.nodes(serviceName);
    console.log(`Discovery result for ${serviceName}:`, JSON.stringify(result, null, 2));
    if (result.length === 0) {
      console.log(`No instances found for ${serviceName}`);
      throw new Error(`Service ${serviceName} not found`);
    }
    const service = result[0];
    const serviceUrl = `http://${service.ServiceAddress}:${service.ServicePort}`;
    console.log(`Constructed service URL: ${serviceUrl}`);
    return serviceUrl;
  } catch (error) {
    console.error(`Error discovering ${serviceName}:`, error);
    throw error;
  }
};

module.exports = {
  getService
};