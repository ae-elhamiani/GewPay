const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Check wallet
router.get('/check-wallet/:walletAddress', async (req, res) => {
  const { walletAddress } = req.params;

  try {
    const user = await User.findById(walletAddress);
    if (user) {
      res.json({ exists: true, isComplete: !!user.email });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking wallet:', error);
    res
      .status(500)
      .json({ message: 'Failed to check wallet', error: error.message });
  }
});

// Connect wallet
router.post('/connect-wallet', async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }

  try {
    let user = await User.findById(walletAddress);

    if (!user) {
      user = new User({ _id: walletAddress });
    }

    await user.save();

    res.status(200).json({
      message: 'Wallet connected successfully',
      user: {
        walletAddress: user._id,
        name: user.name,
        email: user.email,
        pack: user.pack,
      },
    });
  } catch (error) {
    console.error('Error connecting wallet:', error);
    res
      .status(500)
      .json({ message: 'Failed to connect wallet', error: error.message });
  }
});

module.exports = router;
