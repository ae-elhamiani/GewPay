import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import axios from 'axios';
import { useAddress, useMetamask, useDisconnect, useSigner } from '@thirdweb-dev/react';

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
  const [isMerchant, setIsMerchant] = useState(false);
  const [isPremiumMerchant, setIsPremiumMerchant] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const signer = useSigner();

  useEffect(() => {
    if (address) {
      authenticateWithBackend(address);
    }
  }, [address]);

  const checkMerchantStatus = async (address) => {
    try {
      const contract = new ethers.Contract(MERCHANT_REGISTER_ADDRESS, MERCHANT_REGISTER_ABI, signer);

      console.log('Checking merchant status for address:', address);

      const result = await contract.merchantInfo(address);
      console.log('Merchant info result:', result);

      const [isRegistered, isPremium] = result;
      setIsMerchant(isRegistered);
      setIsPremiumMerchant(isPremium);
      console.log(`Merchant status: Registered - ${isRegistered}, Premium - ${isPremium}`);

      return isRegistered;
    } catch (error) {
      console.error('Failed to check merchant status:', error);
      setError(`Failed to check merchant status: ${error.message}`);
      return false;
    }
  };

  const registerMerchant = async () => {
    try {
      const contract = new ethers.Contract(MERCHANT_REGISTER_ADDRESS, MERCHANT_REGISTER_ABI, signer);

      console.log('Registering as merchant...');
      const tx = await contract.registerMerchant();
      console.log('Registration transaction sent:', tx.hash);
      await tx.wait();
      console.log('Registration transaction confirmed');

      setIsMerchant(true);
      navigate('/profile'); // Navigate to /profile after successful registration
    } catch (error) {
      console.error('Failed to register as merchant:', error);
      setError(`Failed to register as merchant: ${error.message}`);
    }
  };

  const authenticateWithBackend = async (address) => {
    try {
      const nonceResponse = await axios.post('http://localhost:5001/api/auth/nonce', { address });
      const nonce = nonceResponse.data.nonce;

      if (!signer) {
        throw new Error("Signer is not available");
      }

      const signature = await signer.signMessage(`Please sign this nonce to authenticate: ${nonce}`);
      console.log(signature);
      
      const authResponse = await axios.post('http://localhost:5001/api/auth/verify', { address, signature });
      const token = authResponse.data.token;
      setToken(token);
      localStorage.setItem('authToken', token);

      const isRegistered = await checkMerchantStatus(address);
      if (!isRegistered) {
        await registerMerchant();
      } else {
        navigate('/profile'); // Navigate to /profile if the merchant is already registered
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setError(`Authentication failed: ${error.message}`);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');
    try {
      await connectWithMetamask();
    } catch (error) {
      console.error('Failed to connect to MetaMask', error);
      setError(`Failed to connect wallet: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setError('Disconnected from MetaMask. Please connect again.');
        navigate('/wallet');
      } else {
        const newAddress = accounts[0];
        await checkMerchantStatus(newAddress);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [signer]);

  return {
    isConnecting,
    error,
    address,
    isMerchant,
    isPremiumMerchant,
    connectWallet,
    disconnect,
  };
};

export default useWalletAuth;
