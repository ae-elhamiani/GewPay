class PaymentError extends Error {
    constructor(message, code) {
      super(message);
      this.name = 'PaymentError';
      this.code = code;
    }
  }
  
  module.exports = PaymentError;