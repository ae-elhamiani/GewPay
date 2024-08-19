import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useAddress, useSigner } from '@thirdweb-dev/react';
import { storeService } from '../../services/storeService';

const STORE_MANAGER_ADDRESS = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'; // Replace with your actual contract address
const STORE_MANAGER_ABI = [
  {
    inputs: [{ name: "acceptedTokens", type: "address[]" }],
    name: "createStore",
    outputs: [{ name: "storeId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "merchant", type: "address" },
      { indexed: false, name: "storeId", type: "uint256" }
    ],
    name: "StoreCreated",
    type: "event"
  }
];

const useStoreCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const address = useAddress();
  const signer = useSigner();

  const createStoreOnBlockchain = useCallback(async (tokenAddresses) => {
    if (!signer) {
      throw new Error('No signer available. Please connect your wallet.');
    }

    try {
      console.log('Token addresses:', tokenAddresses);
      const contract = new ethers.Contract(STORE_MANAGER_ADDRESS, STORE_MANAGER_ABI, signer);
      console.log('Contract instance created');
      
      const tx = await contract.createStore(tokenAddresses);
      console.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);
      
      const event = receipt.events.find(e => e.event === 'StoreCreated');
      if (!event) {
        throw new Error('StoreCreated event not found in transaction receipt');
      }
      
      return event.args.storeId.toNumber();
    } catch (error) {
      console.error('Failed to create store on blockchain:', error);
      if (error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction was rejected. Please try again.');
      } else if (error.message.includes('Merchant not registered')) {
        throw new Error('You need to register as a merchant before creating a store.');
      } else if (error.message.includes('Basic plan merchants can only create one store')) {
        throw new Error('You have reached the store limit for your current plan. Please upgrade to create more stores.');
      } else if (error.message.includes('Token not supported by owner')) {
        throw new Error('One or more of the selected tokens are not supported. Please choose only supported tokens.');
      } else {
        throw new Error(`Failed to create store on blockchain: ${error.message}`);
      }
    }
  }, [signer]);

  const saveStoreToBackend = useCallback(async (address, blockchainStoreId, storeName) => {
    try {
      console.log(address);
      console.log(blockchainStoreId);
      console.log(storeName);
      const response = await storeService.createStore(address, blockchainStoreId, storeName);
      return response.data;
    } catch (error) {
      console.error('Failed to save store to backend:', error);
      throw new Error('Failed to save store information. Please try again.');
    }
  }, []);

  const createStore = async (storeName, selectedTokens) => {
    setIsLoading(true);
    setError('');
    try {
      const tokenAddresses = selectedTokens.map(a => a.addressToken);
      
      const blockchainStoreId = await createStoreOnBlockchain(tokenAddresses);
      console.log('Blockchain store ID:', blockchainStoreId);

      const storeId = await saveStoreToBackend(address, blockchainStoreId, storeName);
      console.log('Backend store ID:', storeId);

      setIsLoading(false);
      return storeId.storeId;
    } catch (error) {
      console.error('Error creating store:', error);
      setIsLoading(false);
      setError(error.message);
      throw error;
    }
  };

  return {
    createStore,
    isLoading,
    error
  };
};

export default useStoreCreation;