require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5005,
  mongoURI: process.env.MONGO_URI || 'mongodb://mongodb:27017/store_db',
  consulHost: process.env.CONSUL_HOST || 'consul',
  consulPort: process.env.CONSUL_PORT || 8500,
  serviceAddress: process.env.SERVICE_ADDRESS || 'store-service',
  graphNodeUrl: process.env.GRAPH_NODE_URL || 'http://graph-node:8000',
  subgraphName: process.env.SUBGRAPH_NAME || 'ae-elhamiani/store-service'
};