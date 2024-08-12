import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddress, useDisconnect, useSigner, useMetamask, useConnectionStatus, useNetwork } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { authService } from '../../services/authService';

const MERCHANT_REGISTER_ADDRESS = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';
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
  const [error, setError] = useState('');
  const [isMerchant, setIsMerchant] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPremiumMerchant, setIsPremiumMerchant] = useState(false);
  const { chain } = useNetwork();


  
  const navigate = useNavigate();
  const address = useAddress();
  const disconnect = useDisconnect();
  const signer = useSigner();
  const connectMetamask = useMetamask();
  const connectionStatus = useConnectionStatus();

  const checkMerchantStatus = useCallback(async (address) => {
    try {
      console.log('Checking merchant status...');
      console.log('Contract address:', MERCHANT_REGISTER_ADDRESS);
      console.log('Current network:', chain?.name);
      
      const contract = new ethers.Contract(MERCHANT_REGISTER_ADDRESS, MERCHANT_REGISTER_ABI, signer);
      const [isRegistered, isPremium] = await contract.merchantInfo(address);
      console.log('Merchant status:', { isRegistered, isPremium });
      setIsMerchant(isRegistered);
      setIsPremiumMerchant(isPremium);
      return isRegistered;
    } catch (error) {
      console.error('Failed to check merchant status:', error);
      if (error.code === 'CALL_EXCEPTION') {
        setError('Failed to interact with the contract. Please ensure you are on the correct network.');
      } else {
        setError('Failed to verify merchant status. Please try again.');
      }
      return false;
    }
  }, [signer, chain]);

  const registerMerchant = useCallback(async (address) => {
    try {
      const contract = new ethers.Contract(MERCHANT_REGISTER_ADDRESS, MERCHANT_REGISTER_ABI, signer);
      const tx = await contract.registerMerchant();
      await tx.wait();
      
      const response = await authService.registerMerchant(address);
      const { merchantId, step } = response.data;

      localStorage.setItem('registrationStep', step);
      
      setIsMerchant(true);
      navigate('/profile');
    } catch (error) {
      console.error('Failed to register as merchant:', error);
      setError('Failed to register as merchant. Please try again.');
    }
  }, [address, signer, navigate]);

  const authenticateWithBackend = useCallback(async (address) => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    try {      
      console.log("hello backend");
      const nonceResponse = await authService.getNonce(address);
      const nonce = nonceResponse.data.nonce;
      console.log("part nonce end");
      console.log(nonce);

      const signature = await signer.signMessage(`Please sign this nonce to authenticate: ${nonce}`);
      console.log("part signature end");
      console.log(signature);

      const authResponse = await authService.verifySignature(address, signature);
      const token = authResponse.data.token;
      localStorage.setItem('authToken', token);
      localStorage.setItem('address', address);
      console.log("saved localStorage");
      console.log(token);
      console.log(address);

      const isRegistered = await checkMerchantStatus(address);

      if (isRegistered) {
        navigate('/dashboard');
      } else {
        await registerMerchant(address);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  }, [signer, navigate, checkMerchantStatus, registerMerchant]);

  const connectWallet = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      console.log('Attempting to connect wallet...');
      await connectMetamask();
      if (address) {
        console.log('Wallet connected successfully:', address);
        await authenticateWithBackend(address);
      } else {
        console.log('Wallet connection failed or no address available');
        setError('Failed to connect wallet. Please try again.');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = useCallback(() => {
    disconnect();
    localStorage.removeItem('authToken');
    localStorage.removeItem('merchantId');
    localStorage.removeItem('registrationStep');
    setIsMerchant(false);
    navigate('/wallet');
  }, [disconnect]);

  useEffect(() => {
    if (address && connectionStatus === "connected" && !localStorage.getItem('authToken') && !isAuthenticating) {
      authenticateWithBackend(address);
    } else if (address && connectionStatus === "connected" && localStorage.getItem('authToken')&& localStorage.removeItem('registrationStep') === "COMPLETE") {
      console.log('Navigating to /profile');
      navigate('/dashboard');
    }
  }, [address, connectionStatus, authenticateWithBackend, navigate, isAuthenticating]);


  useEffect(() => {
    if (connectionStatus === "disconnected") {
      disconnectWallet();

    }
  }, [connectionStatus, disconnectWallet]);

  return {
    error,
    address,
    isMerchant,
    connectWallet,
    disconnectWallet,
    connectionStatus,
    isConnecting,
  };
};

export default useWalletAuth;