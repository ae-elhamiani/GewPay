const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

class WooCommerceService {
  constructor() {
    this.api = new WooCommerceRestApi({
      url: process.env.WOOCOMMERCE_STORE_URL,
      consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
      consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
      version: "wc/v3"
    });
  }

  async getOrder(orderId) {
    try {
      const response = await this.api.get(`orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch WooCommerce order:', error);
      throw new Error('Failed to fetch WooCommerce order');
    }
  }
}

module.exports = new WooCommerceService();