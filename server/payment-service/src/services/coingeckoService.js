const axios = require('axios');

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const SUPPORTED_CRYPTOS = ['bitcoin', 'ethereum', 'tether', 'ripple', 'cardano'];
const CRYPTO_ID_MAP = {
  btc: 'bitcoin',
  eth: 'ethereum',
  usdt: 'tether',
  xrp: 'ripple',
  ada: 'cardano'
};

const getExchangeRate = async (from, to) => {
  console.log(`Fetching exchange rate from ${from} to ${to}`);

  const fiatCurrency = from.toLowerCase();
  let cryptoCurrency = to.toLowerCase();

  // Map short names to full names if necessary
  cryptoCurrency = CRYPTO_ID_MAP[cryptoCurrency] || cryptoCurrency;

  if (!SUPPORTED_CRYPTOS.includes(cryptoCurrency)) {
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

const getConversion = async (req, res) => {
  console.log('Received conversion request:', req.query);
  const { amount, from, to } = req.query;

  if (!amount || !from || !to) {
    console.log('Missing parameters:', { amount, from, to });
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (isNaN(amount)) {
    console.log('Invalid amount:', amount);
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    console.log(`Fetching exchange rate from ${from} to ${to}`);
    const rate = await getExchangeRate(from, to);
    console.log(`Received exchange rate: ${rate}`);

    const convertedAmount = parseFloat(amount) * rate;
    console.log(`Converted ${amount} ${from} to ${convertedAmount} ${to}`);

    res.json({
      from,
      to,
      amount: parseFloat(amount),
      convertedAmount,
      rate,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Conversion error:', error.message);
    res.status(500).json({ error: `Conversion failed: ${error.message}` });
  }
};

module.exports = {
  getExchangeRate,
  getConversion
};