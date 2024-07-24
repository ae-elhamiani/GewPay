// consulWhisperer.js
const consul = require('consul');
const express = require('express');
const config = require('./config');

const app = express();
const consulClient = new consul({
  host: config.consulHost,
  port: config.consulPort,
  promisify: true
});

let serviceCache = {};

function updateCache() {
  consulClient.agent.service.list((err, services) => {
    if (err) {
      console.error("Shh... Consul is sleeping. We'll try again later.");
      return;
    }
    serviceCache = services;
    console.log("The Consul Whisperer has new secrets to share!");
  });
}

// Update cache every 5 seconds
setInterval(updateCache, 5000);

app.get('/whisper/:serviceName', (req, res) => {
  const service = serviceCache[req.params.serviceName];
  if (service) {
    res.json({ url: `http://${service.Address}:${service.Port}` });
  } else {
    res.status(404).send("The spirits are silent about this service...");
  }
});

app.listen(3000, () => console.log('The Consul Whisperer is listening...'));