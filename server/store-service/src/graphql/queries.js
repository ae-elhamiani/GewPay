const { gql } = require('graphql-request');

const GET_STORE_DATA = gql`
  query GetStoreStats($merchantId: Bytes!, $storeId: BigInt!, $startOfDay: BigInt!) {
    stores(where: {merchant: $merchantId, storeId: $storeId}) {
      id
      storeId
      acceptedTokens
      transactionCount
      transactionVolume
      createdAt
      merchant {
        id
        isRegistered
        isPremium
        storeCount
      }
      payments(where: {timestamp_gte: $startOfDay}) {
        client
        fee
        amount
        usdtEquivalent
        timestamp
      }
    }
  }
`;

module.exports = {
  GET_STORE_DATA
};