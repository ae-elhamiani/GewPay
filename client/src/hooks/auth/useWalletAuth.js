import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useWalletAuth = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener(
          'accountsChanged',
          handleAccountsChanged
        );
      };
    }
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      console.log(
        'MetaMask is locked or the user has disconnected their account'
      );
      setAddress('');
      setError('Disconnected from MetaMask. Please connect again.');
    } else {
      const newAddress = accounts[0];
      setAddress(newAddress);
      console.log('Wallet reconnected successfully:', newAddress);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsConnecting(true);
      setError('');
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const address = accounts[0];
        setAddress(address);
        console.log('Wallet connected successfully:', address);

        // Check if wallet exists in the database
        try {
          const response = await axios.get(
            `http://localhost:5001/auth/check-wallet/${address}`
          );
          console.log('Wallet check response:', response.data);

          if (response.data.exists) {
            if (response.data.isComplete) {
              navigate('/dashboard');
            } else {
              navigate('/register-email', {
                state: { walletAddress: address },
              });
            }
          } else {
            // If wallet doesn't exist, save it and redirect to login page
            await saveWalletAddress(address);
            navigate('/register-email', { state: { walletAddress: address } });
          }
        } catch (axiosError) {
          console.error(
            'Error checking wallet:',
            axiosError.response?.data || axiosError.message
          );
          // setError(`Failed to check wallet: ${axiosError.response?.data?.message || axiosError.message}`);
        }
      } catch (error) {
        console.error('Failed to connect to MetaMask', error);
        setError(`Failed to connect wallet: ${error.message}`);
      } finally {
        setIsConnecting(false);
      }
    } else {
      console.log('MetaMask is not installed');
      setError('MetaMask is not installed. Please install it to continue.');
      handleInstallMetaMask();
    }
  };

  const saveWalletAddress = async (address) => {
    try {
      const saveResponse = await axios.post(
        'http://localhost:5001/auth/connect-wallet',
        {
          walletAddress: address,
        }
      );
      console.log('Wallet address saved:', saveResponse.data);
    } catch (error) {
      console.error(
        'Failed to save wallet address:',
        error.response?.data || error.message
      );
      throw new Error(
        `Failed to save wallet address: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleInstallMetaMask = () => {
    window.open('https://metamask.io/download.html', '_blank');
  };

  return {
    isConnecting,
    error,
    connectWallet,
    handleInstallMetaMask,
    address,
  };
};

export default useWalletAuth;
