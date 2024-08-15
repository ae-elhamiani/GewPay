class PaymentError extends Error {
    constructor(message, code) {
      super(message);
      this.name = this.constructor.name;
      this.code = code;
    }
  }
  
  class PaymentNotFoundError extends PaymentError {
    constructor(id) {
      super(`Payment order with ID ${id} not found`, 'PAYMENT_NOT_FOUND');
    }
  }
  
  class InsufficientFundsError extends PaymentError {
    constructor() {
      super('Insufficient funds to process the payment', 'INSUFFICIENT_FUNDS');
    }
  }
  
  class InvalidCurrencyError extends PaymentError {
    constructor(currency) {
      super(`Invalid currency: ${currency}`, 'INVALID_CURRENCY');
    }
  }
  
  module.exports = {
    PaymentError,
    PaymentNotFoundError,
    InsufficientFundsError,
    InvalidCurrencyError,
  };
  