const consulClient = require('../consulClient');

const getService = async (serviceName, retries = 5) => {
  return new Promise((resolve, reject) => {
    const attemptDiscovery = (attemptCount) => {
      console.log(`Attempting to discover service: ${serviceName} (Attempt ${attemptCount})`);

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

        const serviceUrl = `http://${service.Address}:${service.Port}`;
        console.log(`Found service ${serviceName} at ${serviceUrl}`);
        resolve(serviceUrl);
      });
    };

    attemptDiscovery(1);
  });
};

module.exports = { getService };