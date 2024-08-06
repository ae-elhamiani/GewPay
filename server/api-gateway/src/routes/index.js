const express = require('express');
const proxy = require('express-http-proxy');
const { getService } = require('../services/serviceDiscovery');

const router = express.Router();

const proxyMiddleware = (serviceName) => {
  return async (req, res, next) => {
    console.log(`Received request for ${serviceName}:${req.method} ${req.url}`);
    try {
      console.log(`Attempting to discover service: ${serviceName}`);
      const serviceUrl = await getService(serviceName);
      console.log(`Service URL for ${serviceName}: ${serviceUrl}`);
      console.log(`Proxying request to ${serviceUrl}${req.url}`);
      proxy(serviceUrl, {
        proxyReqPathResolver: (req) => {
          console.log(`Resolving path: ${req.url}`);
          return req.url;
        },
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
          console.log(`Received response from ${serviceName}: Status ${proxyRes.statusCode}`);
          return proxyResData;
        }
      })(req, res, next);
    } catch (error) {
      console.error(`Error routing to ${serviceName}:`, error);
      res.status(503).json({ error: `${serviceName} unavailable` });
    }
  };
};

router.use('/auth', proxyMiddleware('auth-service'));
router.use('/merchants', proxyMiddleware('merchant-service'));
router.use('/notif', proxyMiddleware('notification-service'));


module.exports = router;