const axios = require('axios');

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

exports.getExchangeRate = async (from, to) => {
  console.log(`Fetching exchange rate from ${from} to ${to}`);

  // Assuming 'from' is always fiat and 'to' is always crypto
  const fiatCurrency = from.toLowerCase();
  const cryptoCurrency = to.toLowerCase();

  // List of supported cryptocurrencies
  const supportedCryptos = ['bitcoin', 'ethereum', 'tether', 'ripple', 'cardano'];

  if (!supportedCryptos.includes(cryptoCurrency)) {
    throw new Error(`Unsupported cryptocurrency: ${cryptoCurrency}`);
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: cryptoCurrency,
        vs_currencies: fiatCurrency,
      },
      timeout: 10000
    });

    console.log('CoinGecko API response:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data[cryptoCurrency] || !response.data[cryptoCurrency][fiatCurrency]) {
      throw new Error('Invalid response structure from CoinGecko');
    }

    const rate = response.data[cryptoCurrency][fiatCurrency];

    // We want how much crypto you get for 1 unit of fiat
    const convertedRate = 1 / rate;

    console.log(`Exchange rate: 1 ${from} = ${convertedRate} ${to}`);
    return convertedRate;
  } catch (error) {
    console.error('Error in getExchangeRate:', error.message);
    if (error.response) {
      console.error('CoinGecko API error details:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      });
    }
    throw new Error(`Failed to fetch exchange rate: ${error.message}`);
  }
};