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
  {
    inputs: [],
    name: "registerMerchant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const useWalletAuth = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [isMerchant, setIsMerchant] = useState(false);
  const [isPremiumMerchant, setIsPremiumMerchant] = useState(false);
  const navigate = useNavigate();

  const checkMerchantStatus = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MERCHANT_REGISTER_ADDRESS, MERCHANT_REGISTER_ABI, signer);
      
      console.log('Checking merchant status for address:', address);

      const result = await contract.merchantInfo(address);
      console.log('Merchant info result:', result);

      const [isRegistered, isPremium] = result;
      setIsMerchant(isRegistered);
      setIsPremiumMerchant(isPremium);
      console.log(`Merchant status: Registered - ${isRegistered}, Premium - ${isPremium}`);

      if (isRegistered) {
        navigate('/more-info');
      }

      return isRegistered;
    } catch (error) {
      console.error('Failed to check merchant status:', error);
      setError(`Failed to check merchant status: ${error.message}`);
      return false;
    }
  };

  const registerMerchant = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MERCHANT_REGISTER_ADDRESS, MERCHANT_REGISTER_ABI, signer);

      console.log('Registering as merchant...');
      const tx = await contract.registerMerchant();
      console.log('Registration transaction sent:', tx.hash);
      await tx.wait();
      console.log('Registration transaction confirmed');

      setIsMerchant(true);
      navigate('/more-info');
    } catch (error) {
      console.error('Failed to register as merchant:', error);
      setError(`Failed to register as merchant: ${error.message}`);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsConnecting(true);
      setError('');
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const newAddress = accounts[0];
        setAddress(newAddress);
        console.log('Wallet connected successfully:', newAddress);
        
        const isRegistered = await checkMerchantStatus(newAddress);
        if (!isRegistered) {
          await registerMerchant();
        }
      } catch (error) {
        console.error('Failed to connect to MetaMask', error);
        setError(`Failed to connect wallet: ${error.message}`);
      } finally {
        setIsConnecting(false);
      }
    } else {
      setError('MetaMask is not installed. Please install it to continue.');
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setAddress('');
      setError('Disconnected from MetaMask. Please connect again.');
      navigate('/');
    } else {
      const newAddress = accounts[0];
      setAddress(newAddress);
      await checkMerchantStatus(newAddress);
    }
  };

  return {
    isConnecting,
    error,
    address,
    isMerchant,
    isPremiumMerchant,
    connectWallet,
  };
};

export default useWalletAuth;