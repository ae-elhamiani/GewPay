import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useWalletAuth = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
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

  const handleAccountsChanged = (accounts) => {
    console.log('handleAccountsChanged called with accounts:', accounts);
    if (accounts.length === 0) {
      console.log('MetaMask is locked or the user has disconnected their account');
      setAddress('');
      setError('Disconnected from MetaMask. Please connect again.');
      navigate('/wallet-authentication'); // Redirect to wallet authentication page
    } else {
      const newAddress = accounts[0];
      setAddress(newAddress);
      console.log('Wallet reconnected successfully:', newAddress);
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
      } catch (error) {
        console.error('Failed to connect to MetaMask', error);
        setError(`Failed to connect wallet: ${error.message}`);
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const handleInstallMetaMask = () => {
    window.open('https://metamask.io/download.html', '_blank');
  };

  return {
    isConnecting,
    error,
    address,
    connectWallet,
    handleInstallMetaMask,
  };
};

export default useWalletAuth;
