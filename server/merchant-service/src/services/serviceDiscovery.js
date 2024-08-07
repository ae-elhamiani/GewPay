const consulClient = require('./consulClient');

async function getServiceUrl(serviceName) {
  try {
    const result = await consulClient.catalog.service.nodes(serviceName);
    if (result.length === 0) {
      throw new Error(`Service ${serviceName} not found`);
    }
    const service = result[0];
    return `http://${service.ServiceAddress}:${service.ServicePort}`;
  } catch (error) {
    console.error(`Error discovering ${serviceName}:`, error);
    throw error;
  }
}

module.exports = { getServiceUrl };