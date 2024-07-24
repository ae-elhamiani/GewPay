const consul = require('consul');
const config = require('../config');
const consulClient = require('../consulClient');


const getService = (service, retries = 5) => {
  return new Promise((resolve, reject) => {
    const attemptDiscovery = (attemptCount) => {
      console.log(`Attempting to discover service: ${service} (Attempt ${attemptCount})`);
      console.log(`Consul config: ${JSON.stringify({ host: config.consulHost, port: config.consulPort })}`);

      consulClient.agent.service.list((err, services) => {
        if (err) {
          console.error('Error fetching services from Consul:', err);
          if (attemptCount < retries) {
            console.log(`Retrying in 5 seconds...`);
            setTimeout(() => attemptDiscovery(attemptCount + 1), 5000);
          } else {
            reject(new Error(`Failed to fetch services after ${retries} attempts`));
          }
          return;
        }

        console.log('All services:', JSON.stringify(services, null, 2));

        const service = Object.values(services).find(s => s.Service === serviceName);

        if (!service) {
          console.error(`Service ${serviceName} not found in Consul`);
          if (attemptCount < retries) {
            console.log(`Retrying in 5 seconds...`);
            setTimeout(() => attemptDiscovery(attemptCount + 1), 5000);
          } else {
            reject(new Error(`Service ${serviceName} not found after ${retries} attempts`));
          }
          return;
        }
        if (service) {
            console.log(`Found service details:`, JSON.stringify(service, null, 2));
            const serviceUrl = `http://${service.Address}:${service.Port}`;
            console.log(`Constructed service URL: ${serviceUrl}`);
            resolve(serviceUrl);
          }
      });
    };

    attemptDiscovery(1);
  });
};

module.exports = {
  getService
};