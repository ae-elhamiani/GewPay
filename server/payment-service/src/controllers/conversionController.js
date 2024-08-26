const { getExchangeRate } = require('../services/coingeckoService');

exports.getConversion = async (req, res) => {
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