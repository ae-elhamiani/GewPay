import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

const MERCHANT_REGISTER_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const MERCHANT_REGISTER_ABI = [
  {
    inputs: [{ name: "merchant", type: "address" }],
    name: "merchantInfo",
    outputs: [
      { name: "isRegistered", type: "bool" },
      { name: "isPremium", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  
];

const useWalletAuth = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [isMerchant, setIsMerchant] = useState(false);
  const [isPremiumMerchant, setIsPremiumMerchant] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isMetaMaskAvailable()) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const isMetaMaskAvailable = () => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is available');
      return true;
    } else {
      console.log('MetaMask is not available');
      setError('MetaMask is not available. Please install it to continue.');
      return false;
    }
  };

  const handleAccountsChanged = async (accounts) => {
    console.log('handleAccountsChanged called with accounts:', accounts);
    if (accounts.length === 0) {
      console.log('MetaMask is locked or the user has disconnected their account');
      setAddress('');
      setError('Disconnected from MetaMask. Please connect again.');
      navigate('/wallet-authentication');
    } else {
      const newAddress = accounts[0];
      setAddress(newAddress);
      console.log('Wallet reconnected successfully:', newAddress);
      await checkMerchantStatus(newAddress);
    }
  };

  const connectWallet = async () => {
    if (isMetaMaskAvailable()) {
      setIsConnecting(true);
      setError('');
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const newAddress = accounts[0];
        setAddress(newAddress);
        console.log('Wallet connected successfully:', newAddress);
        await checkMerchantStatus(newAddress);
      } catch (error) {
        console.error('Failed to connect to MetaMask', error);
        setError(`Failed to connect wallet: ${error.message}`);
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const checkMerchantStatus = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MERCHANT_REGISTER_ADDRESS, MERCHANT_REGISTER_ABI, signer);
      
      console.log('Checking merchant status for address:', address);
      console.log('Contract address:', MERCHANT_REGISTER_ADDRESS);
      console.log('ABI:', JSON.stringify(MERCHANT_REGISTER_ABI));
  
      // Try to call the function
      const result = await contract.merchantInfo(address);
      console.log('Raw result:', result);
  
      const [isRegistered, isPremium] = result;
      setIsMerchant(isRegistered);
      setIsPremiumMerchant(isPremium);
      console.log(`Merchant status: Registered - ${isRegistered}, Premium - ${isPremium}`);
    } catch (error) {
      console.error('Failed to check merchant status:', error);
      if (error.code === 'BAD_DATA') {
        console.error('Possible ABI mismatch. Check that the ABI matches the deployed contract.');
      }
      setError(`Failed to check merchant status: ${error.message}`);
    }
  };

  const handleInstallMetaMask = () => {
    window.open('https://metamask.io/download.html', '_blank');
  };

  return {
    isConnecting,
    error,
    address,
    isMerchant,
    isPremiumMerchant,
    connectWallet,
    handleInstallMetaMask,
  };
};

export default useWalletAuth;