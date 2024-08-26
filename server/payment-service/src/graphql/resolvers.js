// src/graphql/resolvers.js
const resolvers = {
  Query: {
    getPaymentSession: async (_, { sessionId }, { dataSources }) => {
      try {
        console.log('Searching for sessionId:', sessionId);
        const session = await dataSources.paymentSessionAPI.getPaymentSessionBySessionId(sessionId);
        console.log('Found session:', session);
        if (!session) {
          console.log(`No session found for sessionId: ${sessionId}`);
          return null;
        }
        return session;
      } catch (error) {
        console.error('Error fetching payment session:', error);
        throw new Error('Failed to fetch payment session');
      }
    },
    getAllPaymentSessions: async (_, __, { dataSources }) => {
      return await dataSources.paymentSessionAPI.getAllPaymentSessions();
    },
  },
  Mutation: {
    createPaymentSession: async (_, { input }, { dataSources }) => {
      try {
        const sessionData = {
          ...input,
          sessionId: uuidv4(),
          expiresAt: new Date(Date.now() + 30 * 60000), // 30 minutes from now
          status: 'PENDING'
        };
        
        console.log('Creating session with data:', JSON.stringify(sessionData, null, 2));
        const newSession = await dataSources.paymentSessionAPI.createPaymentSession(sessionData);
        console.log('Created session:', JSON.stringify(newSession, null, 2));
        
        return newSession;
      } catch (error) {
        console.error('Error creating payment session:', error);
        throw new Error('Failed to create payment session');
      }
    },
    updatePaymentDetails: async (_, { sessionId, paymentMethod, paymentAddress }, { dataSources }) => {
      try {
        const updatedSession = await dataSources.paymentSessionAPI.updatePaymentDetails(sessionId, paymentMethod, paymentAddress);
        return updatedSession;
      } catch (error) {
        console.error('Error updating payment details:', error);
        throw new Error('Failed to update payment details');
      }
    },
    completePayment: async (_, { sessionId }, { dataSources }) => {
      try {
        const completedSession = await dataSources.paymentSessionAPI.completePayment(sessionId);
        return completedSession;
      } catch (error) {
        console.error('Error completing payment:', error);
        throw new Error('Failed to complete payment');
      }
    },
  },
};

module.exports = resolvers;
