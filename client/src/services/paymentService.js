import api from './api';

export const paymentService = {

      getConversion: (amount, from, to) => 
        api.get('/payment/convert', { params: { amount, from, to } }),
    
    };
    
    export default paymentService;