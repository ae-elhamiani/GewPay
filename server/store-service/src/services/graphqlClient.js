const axios = require('axios');
const config = require('../config');
const { GET_STORE_DATA } = require('../graphql/queries');

const graphqlEndpoint = `${config.graphNodeUrl}/subgraphs/name/${config.subgraphName}`;

async function fetchStoreData(merchantId, storeId) {
  try {
    const startOfDay = BigInt(Math.floor(Date.now() / 86400000) * 86400).toString();

    const response = await axios.post(graphqlEndpoint, {
      query: GET_STORE_DATA,
      variables: { 
        merchantId: merchantId.toLowerCase(),
        storeId: BigInt(storeId).toString(),
        startOfDay
      }
    });

    const data = response.data.data;
    if (data.stores && data.stores.length > 0) {
      const store = data.stores[0];
      
      // Calculate today's stats
      const todayStats = {
        transactionCount: store.payments.length,
        transactionVolume: store.payments.reduce((sum, payment) => 
          sum + BigInt(payment.usdtEquivalent), BigInt(0)
        ).toString()
      };

      return {
        ...store,
        todayStats
      };
    } else {
      throw new Error('Store not found on blockchain');
    }
  } catch (error) {
    console.error('Error fetching store data from blockchain:', error);
    throw error;
  }
}

module.exports = {
  fetchStoreData
};