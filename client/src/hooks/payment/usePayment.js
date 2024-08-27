import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import axios from 'axios';
import { ethers } from 'ethers';
import { GET_PAYMENT_SESSION } from '../../graphql/queries';
import storeService from '../../services/storeService';
import { toast } from 'react-toastify';

const PAYMENT_CONTRACT_ADDRESS = '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9';

const ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "merchant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "storeId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "usdtEquivalent",
        "type": "uint256"
      }
    ],
    "name": "processPayment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

const usePayment = () => {
  const { sessionId } = useParams();
  const [conversionData, setConversionData] = useState(null);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState('');
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const contractRef = useRef(null);
  const timerRef = useRef(null);

  const { loading, error: queryError, data } = useQuery(GET_PAYMENT_SESSION, {
    variables: { sessionId },
  });

  const session = data?.getPaymentSession;

  useEffect(() => {
    if (session) {
      const expiresAt = new Date(session.expiresAt);
      const currentTime = new Date();
      const remainingTimeInSeconds = Math.round((expiresAt - currentTime) / 1000);

      setRemainingTime(remainingTimeInSeconds);

      timerRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            toast.error('Transaction time has expired. Please start a new session.');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [session]);

  useEffect(() => {
    const fetchSupportedTokens = async () => {
      if (session) {
        try {
          const response = await storeService.getAcceptedTokens(session.storeId);
          console.log('Fetched tokens:', response.data);
          setTokens(response.data);
        } catch (error) {
          console.error('Error fetching supported tokens:', error);
          toast.error('Failed to fetch supported tokens. Please try again later.');
        }
      }
    };

    fetchSupportedTokens();
  }, [session]);

  useEffect(() => {
    const fetchConversion = async () => {
      if (session && selectedToken) {
        try {
          const response = await axios.get('http://localhost:5006/api/convert', {
            params: {
              amount: session.amount,
              from: session.currency.toLowerCase(),
              to: selectedToken.toLowerCase(),
            },
          });

          if (response.data) {
            setConversionData({
              ...response.data,
              ethereumAddress: session.merchantId,
              storeId: session.storeId,
            });
            setCryptoPrice(response.data.convertedAmount);
          } else {
            throw new Error('Conversion data is not available.');
          }
        } catch (error) {
          console.error('Error fetching conversion:', error);
          toast.error('Failed to fetch conversion data. Please try again.');
        }
      }
    };

    fetchConversion();
  }, [session, selectedToken]);

  const loadContract = useCallback(async (signer) => {
    try {
      const newContract = new ethers.Contract(
        PAYMENT_CONTRACT_ADDRESS,
        ABI,
        signer
      );
      return newContract;
    } catch (error) {
      console.error('Error loading contract:', error);
      toast.error(`Failed to load payment contract: ${error.message}`);
      return null;
    }
  }, []);

  const handlePayButtonClick = useCallback(async () => {
    if (!conversionData || !selectedToken) {
      toast.error('Conversion data or token not available. Cannot proceed with payment.');
      return null;
    }

    const { convertedAmount, ethereumAddress, storeId } = conversionData;
    if (!convertedAmount || !ethereumAddress || !storeId) {
      toast.error('Conversion data is incomplete. Cannot proceed with payment.');
      console.error('Conversion data is missing necessary fields:', conversionData);
      return null;
    }

    try {
      if (!window.ethereum) {
        throw new Error('No crypto wallet found. Please install MetaMask.');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const paymentContract = await loadContract(signer);
      if (!paymentContract) {
        throw new Error('Failed to load payment contract');
      }

      const selectedTokenData = tokens.find(t => t.symbol === selectedToken);
      if (!selectedTokenData) {
        console.error('Available tokens:', tokens);
        throw new Error(`Selected token data not found for symbol: ${selectedToken}`);
      }

      console.log(selectedTokenData.addressToken);
      if (!selectedTokenData.addressToken) {
        throw new Error(`Token address is undefined for symbol: ${selectedToken}`);
      }

      const amountInToken = ethers.utils.parseUnits(convertedAmount.toString(), selectedTokenData.decimals);

      const storeIdNumber = parseInt(storeId.split('-')[1], 10);
      if (isNaN(storeIdNumber)) {
        throw new Error(`Invalid storeId format: ${storeId}`);
      }
      console.log('Payment parameters:', {
        ethereumAddress,
        storeId: storeIdNumber,
        tokenAddress: selectedTokenData.addressToken,
        amount: amountInToken.toString(),
        usdtEquivalent: amountInToken.toString(),
      });

      setPaymentProgress(25);
      toast.info('Initiating transaction...');

      const tx = await paymentContract.processPayment(
        ethereumAddress,
        storeIdNumber,
        selectedTokenData.addressToken,
        amountInToken,
        amountInToken,
        { value: selectedTokenData.addressToken === ethers.constants.AddressZero ? amountInToken : 0 }
      );

      setPaymentProgress(50);
      toast.info('Transaction sent. Waiting for confirmation...');

      const receipt = await tx.wait();

      setPaymentProgress(100);
      toast.success('Payment confirmed!');
      //thank you page 
      //end point payment completed

    

      console.log(`Transaction hash: ${receipt.transactionHash}`);
      return receipt.transactionHash;
    } catch (err) {
      console.error('Payment failed:', err);
      toast.error(`Payment failed: ${err.message}`);
      //
       //end point payment failed

      setPaymentProgress(0);
      return null;
    }
  }, [conversionData, selectedToken, tokens, loadContract]);

  return {
    loading,
    queryError,
    session,
    tokens,
    selectedToken,
    setSelectedToken,
    cryptoPrice,
    conversionData,
    error,
    remainingTime,
    handlePayButtonClick,
    paymentProgress,
  };
};

export default usePayment;