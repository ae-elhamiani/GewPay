import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import axios from 'axios';
import { ethers } from 'ethers';
import { GET_PAYMENT_SESSION } from '../../graphql/queries';
import { CryptoTransactionTimer } from '../../components/payments/CryptoTransactionTimer';
import storeService from '../../services/storeService';

// Import your contract's ABI and set the contract address
import PaymentContractABI from '../../abis/PaymentContract.json';
const paymentContractAddress = '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9'; // Replace with your deployed contract address
const AddressZero = '0x0000000000000000000000000000000000000000';

const usePayment = () => {
  const { sessionId } = useParams();
  const [conversionData, setConversionData] = useState(null);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null); // 15 minutes in seconds
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState('');
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const timerRef = useRef(null);
  

  const {
    loading,
    error: queryError,
    data,
  } = useQuery(GET_PAYMENT_SESSION, {
    variables: { sessionId },
  });

  useEffect(() => {
    if (data && data.getPaymentSession) {
      const expiresAt = new Date(data.getPaymentSession.expiresAt);
      const currentTime = new Date();
      const remainingTimeInSeconds = Math.round(
        (expiresAt - currentTime) / 1000
      );

      setRemainingTime(remainingTimeInSeconds); // Set the initial remaining time

      timerRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setError(
              'Transaction time has expired. Please start a new session.'
            );
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [data]);

  useEffect(() => {
    const fetchSupportedTokens = async () => {
      try {
        if (data?.getPaymentSession) {
          const storeId = data.getPaymentSession.storeId; // No need to split
          const response = await storeService.getAcceptedTokens(storeId);
          console.log('Fetched Tokens:', response.data); // Debugging log
          setTokens(response.data);
        }
      } catch (error) {
        console.error('Error fetching supported tokens:', error);
        setError('Failed to fetch supported tokens. Please try again later.');
      }
    };

    fetchSupportedTokens();
  }, [data]);

  useEffect(() => {
    const fetchConversion = async () => {
      if (data?.getPaymentSession && selectedToken) {
        console.log('Attempting to fetch conversion data with:', {
          amount: data.getPaymentSession.amount,
          from: data.getPaymentSession.currency.toLowerCase(),
          to: selectedToken.toLowerCase(),
        });

        try {
          const response = await axios.get(
            'http://localhost:5006/api/convert',
            {
              params: {
                amount: data.getPaymentSession.amount,
                from: data.getPaymentSession.currency.toLowerCase(),
                to: selectedToken.toLowerCase(),
              },
            }
          );

          console.log('Conversion API response:', response.data);

          if (response.data) {
            setConversionData({
              ...response.data,
              ethereumAddress: data.getPaymentSession.merchantId,
              storeId: data.getPaymentSession.storeId,
            });
            setCryptoPrice(response.data.convertedAmount);
            console.log('Updated conversionData:', response.data);
          } else {
            setError('Conversion data is not available.');
          }
        } catch (error) {
          console.error('Error fetching conversion:', error);
          setError('Failed to fetch conversion data.');
        }
      }
    };

    fetchConversion();
  }, [data, selectedToken]);

  const handlePayButtonClick = async () => {
    if (!conversionData) {
      setError(
        'Conversion data is not available. Cannot proceed with payment.'
      );
      return;
    }

    const { convertedAmount, ethereumAddress, storeId } = conversionData;
    if (convertedAmount === undefined || !ethereumAddress || !storeId) {
      setError('Conversion data is incomplete. Cannot proceed with payment.');
      console.error(
        'Conversion data is missing necessary fields:',
        conversionData
      );
      return;
    }

    try {
      if (!window.ethereum) {
        throw new Error('No crypto wallet found. Please install MetaMask.');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const paymentContract = new ethers.Contract(
        paymentContractAddress,
        PaymentContractABI.abi,
        signer
      );

      const amountInEth = ethers.utils.parseEther(convertedAmount.toString());

      console.log('Parsed amountInEth:', amountInEth.toString());

      const tx = await paymentContract.processPayment(
        ethereumAddress,
        parseInt(storeId),
        AddressZero,
        amountInEth
      );

      console.log(`Transaction hash: ${tx.hash}`);
      alert('Payment sent successfully!');
    } catch (err) {
      console.error('Payment failed:', err.message);
      setError('Payment failed: ' + err.message);
    }
  };

  return {
    loading,
    queryError,
    session: data?.getPaymentSession,
    tokens,
    selectedToken,
    setSelectedToken,
    cryptoPrice,
    conversionData,
    error,
    remainingTime,
    handlePayButtonClick,
  };
};

export default usePayment;
