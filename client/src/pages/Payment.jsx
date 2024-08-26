import React, { useState, useEffect } from 'react';
import { ConnectWallet, useAddress, useDisconnect } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import usePayment from '../hooks/payment/usePayment';
import { Copy } from 'lucide-react';
import Logo from '../components/common/Logo';

const Payment = () => {
  const {
    loading,
    queryError,
    session,
    selectedToken,
    setSelectedToken,
    tokens,
    cryptoPrice,
    error,
    remainingTime,
    paymentContractAddress,
  } = usePayment();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false); // Track wallet connection
  const [copyStatus, setCopyStatus] = useState({
    amount: false,
    address: false,
  });

  const address = useAddress(); // Get the connected wallet address
  const disconnect = useDisconnect();

  // Update wallet connection status based on the address
  useEffect(() => {
    setWalletConnected(!!address);
  }, [address]);

  const handleTokenSelect = (token) => {
    setSelectedToken(token.symbol);
    setIsDropdownOpen(false);
  };

  const formatTime = (seconds) => {
    if (seconds === null) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePayment = async () => {
    if (!cryptoPrice || !selectedToken) {
      throw new Error('Please select a token and wait for price calculation');
    }

    const amountInToken = ethers.utils.parseUnits(cryptoPrice.toString(), 18);
    const selectedTokenAddress = tokens.find(
      (t) => t.symbol === selectedToken
    ).address;

    // Logic to handle payment using the contract
    const contract = new ethers.Contract(paymentContractAddress);
    await contract.processPayment(
      session.merchantId,
      session.storeId,
      selectedTokenAddress,
      amountInToken,
      amountInToken
    );

    alert('Payment successful!');
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopyStatus((prevState) => ({ ...prevState, [type]: true }));
    setTimeout(() => {
      setCopyStatus((prevState) => ({ ...prevState, [type]: false }));
    }, 2000); // Reset after 2 seconds
  };

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (queryError)
    return <p className="text-red-500">Error: {queryError.message}</p>;
  if (!session)
    return <p className="text-gray-600">No session data available</p>;

  return (
    <div className="bg-white shadow-lg rounded-lg max-w-2xl mx-auto p-8 mt-12 border border-gray-200 transition-shadow duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center ">
          <Logo />
        </div>

        <div className="flex items-center">
          <span
            className={`font-bold border rounded-lg px-3 py-1 ${
              remainingTime !== null && remainingTime <= 180
                ? 'text-red-600 border-red-600'
                : 'text-purple-600 border-purple-600'
            }`}
          >
            {remainingTime !== null ? formatTime(remainingTime) : ''}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-8">
        <h1 className="text-center font-bold text-3xl text-gray-800 mr-4">
          Amount To Pay:
        </h1>
        <p className="text-center text-4xl font-bold text-purple-600">
          {session.amount} {session.currency}
        </p>
      </div>

      <div className="mb-6 relative">
        <p className="text-md text-black-600 mb-2 font-medium">
          Choose Currency
        </p>
        <div
          className="w-full bg-gray-50 border border-gray-300 rounded-md py-3 px-4 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition duration-150"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedToken ? (
            <>
              <span className="font-medium text-gray-800">
                {tokens.find((t) => t.symbol === selectedToken).name} (
                {selectedToken.toUpperCase()})
              </span>
              <span className="text-gray-400">▼</span>
            </>
          ) : (
            <span className="text-gray-400">Select currency</span>
          )}
        </div>
        {isDropdownOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
            {tokens && tokens.length > 0 ? (
              tokens.map((token) => (
                <div
                  key={token._id}
                  onClick={() => handleTokenSelect(token)}
                  className="flex items-center py-3 px-4 hover:bg-gray-50 cursor-pointer transition duration-150"
                >
                  <img
                    src={token.logo}
                    alt={token.name}
                    className="w-6 h-6 mr-3"
                  />
                  <span className="font-medium text-gray-800">
                    {token.name} ({token.symbol.toUpperCase()})
                  </span>
                </div>
              ))
            ) : (
              <div className="py-3 px-4 text-gray-500">No tokens available</div>
            )}
          </div>
        )}
      </div>

      {walletConnected && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <div className="mb-4">
            <p className="text-gray-600 font-medium">Amount</p>
            <div className="flex items-center justify-between bg-purple-100 rounded-md p-3">
              <span className="text-xl font-bold text-gray-800">
                {cryptoPrice ? cryptoPrice.toFixed(8) : '0'}{' '}
                {selectedToken ? selectedToken.toUpperCase() : ''}
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `${cryptoPrice ? cryptoPrice.toFixed(8) : '0'} ${
                      selectedToken ? selectedToken.toUpperCase() : ''
                    }`,
                    'amount'
                  )
                }
                className="text-gray-600 font-medium hover:text-purple-800 transition-colors"
              >
                <Copy className="h-5 w-5 inline-block mr-1" />
                <span>{copyStatus.amount ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Address</p>
            <div className="flex items-center justify-between bg-purple-100 rounded-md p-3">
              <span className="text-gray-800  break-all">
                {session.merchantId}
              </span>
              <button
                onClick={() => copyToClipboard(session.merchantId, 'address')}
                className="text-gray-600 font-medium hover:text-purple-800 transition-colors"
              >
                <Copy className="h-5 w-5 inline-block mr-1" />
                <span>{copyStatus.address ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center mb-4">
        {!walletConnected && (
          <ConnectWallet
            onConnect={() => setWalletConnected(true)} // This triggers when the wallet connects successfully
            style={{
              backgroundColor: selectedToken ? '#6B21A8' : '#D3B4FC', // Dark purple when enabled, light purple when disabled
              color: 'white',
              cursor: selectedToken ? 'pointer' : 'not-allowed',
              padding: '12px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              lineHeight: '24px',
              transition: 'background-color 0.15s ease-in-out',
              display: 'inline-block',
              textAlign: 'center',
              width: '100%', // Ensure the button spans the container width
            }}
          />
        )}
      </div>

      <div className="flex justify-center">
        {walletConnected && (
          <button
            onClick={handlePayment}
            disabled={!walletConnected || !selectedToken} // Disabled until wallet is connected and currency is selected
            style={{
              backgroundColor:
                walletConnected && selectedToken ? '#6B21A8' : '#D3B4FC', // Dark purple when enabled, light purple when disabled
              color: 'white', // Explicit text color
              cursor:
                walletConnected && selectedToken ? 'pointer' : 'not-allowed',
              padding: '12px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              lineHeight: '24px',
              transition: 'background-color 0.15s ease-in-out',
              display: 'inline-block',
              textAlign: 'center',
              width: '100%', // Ensure the button spans the container width
            }}
          >
            Pay
          </button>
        )}
      </div>

      {(error || paymentError) && (
        <p className="text-red-500 mt-4 text-center bg-red-50 border border-red-200 rounded-md p-3">
          {error || paymentError}
        </p>
      )}
    </div>
  );
};

export default Payment;
