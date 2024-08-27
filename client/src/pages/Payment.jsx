import React, { useState } from 'react';
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';
import usePayment from '../hooks/payment/usePayment';
import { Copy, CheckCircle, Loader, Clock, CreditCard } from 'lucide-react';
import Logo from '../components/common/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment = () => {
  const {
    loading,
    session,
    selectedToken,
    setSelectedToken,
    tokens,
    cryptoPrice,
    remainingTime,
    handlePayButtonClick,
  } = usePayment();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState({ amount: false, address: false });
  const [paymentStatus, setPaymentStatus] = useState(null);

  const address = useAddress();
  const walletConnected = !!address;

  if (loading || !session) return <LoadingScreen />;

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
    setPaymentStatus('processing');
    try {
      await handlePayButtonClick();
      setPaymentStatus('success');
      toast.success('Payment successful!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setPaymentStatus('failed');
      toast.error(`Payment failed: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopyStatus((prevState) => ({ ...prevState, [type]: true }));
    setTimeout(() => setCopyStatus((prevState) => ({ ...prevState, [type]: false })), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white shadow-lg rounded-lg max-w-2xl mx-auto p-8 mt-12 border border-gray-200 transition-shadow duration-300 hover:shadow-xl"
    >
      <ToastContainer />
      <Header remainingTime={remainingTime} formatTime={formatTime} />
      <AmountDisplay session={session} />
      <TokenSelector
        selectedToken={selectedToken}
        tokens={tokens}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        handleTokenSelect={handleTokenSelect}
      />
      {walletConnected && (
        <PaymentDetails
          cryptoPrice={cryptoPrice}
          selectedToken={selectedToken}
          session={session}
          copyToClipboard={copyToClipboard}
          copyStatus={copyStatus}
        />
      )}
      <WalletConnection
        walletConnected={walletConnected}
        selectedToken={selectedToken}
        handlePayment={handlePayment}
        paymentStatus={paymentStatus}
      />
    </motion.div>
  );
};

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader className="animate-spin h-12 w-12 text-purple-600" />
  </div>
);

const Header = ({ remainingTime, formatTime }) => (
  <div className="flex items-center justify-between mb-12">
    <Logo />
    <div className={`flex items-center font-bold border rounded-lg px-3 py-1 ${
      remainingTime !== null && remainingTime <= 180
        ? 'text-red-600 border-red-600'
        : 'text-purple-600 border-purple-600'
    }`}>
      <Clock className="mr-2" />
      {remainingTime !== null ? formatTime(remainingTime) : ''}
    </div>
  </div>
);

const AmountDisplay = ({ session }) => (
  <div className="flex items-center justify-center mb-8">
    <h1 className="text-center font-bold text-3xl text-gray-800 mr-4">Amount To Pay:</h1>
    <p className="text-center text-4xl font-bold text-purple-600">
      {session.amount} {session.currency}
    </p>
  </div>
);

const TokenSelector = ({ selectedToken, tokens, isDropdownOpen, setIsDropdownOpen, handleTokenSelect }) => (
  <div className="mb-6 relative">
    <p className="text-md text-black-600 mb-2 font-medium">Choose Currency</p>
    <div
      className="w-full bg-gray-50 border border-gray-300 rounded-md py-3 px-4 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition duration-150"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      {selectedToken ? (
        <>
          <span className="font-medium text-gray-800">
            {tokens.find((t) => t.symbol === selectedToken).name} ({selectedToken.toUpperCase()})
          </span>
          <span className="text-gray-400">▼</span>
        </>
      ) : (
        <span className="text-gray-400">Select currency</span>
      )}
    </div>
    <AnimatePresence>
      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg"
        >
          {tokens.map((token) => (
            <div
              key={token._id}
              onClick={() => handleTokenSelect(token)}
              className="flex items-center py-3 px-4 cursor-pointer hover:bg-gray-50 transition duration-150"
            >
              <img src={token.logo} alt={token.name} className="w-6 h-6 mr-3" />
              <span className="font-medium text-gray-800">
                {token.name} ({token.symbol.toUpperCase()})
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const PaymentDetails = ({ cryptoPrice, selectedToken, session, copyToClipboard, copyStatus }) => (
  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
    <div className="mb-4">
      <p className="text-gray-600 font-medium">Amount</p>
      <div className="flex items-center justify-between bg-purple-100 rounded-md p-3">
        <span className="text-xl font-bold text-gray-800">
          {cryptoPrice ? cryptoPrice.toFixed(8) : '0'} {selectedToken ? selectedToken.toUpperCase() : ''}
        </span>
        <button
          onClick={() => copyToClipboard(`${cryptoPrice ? cryptoPrice.toFixed(8) : '0'} ${selectedToken ? selectedToken.toUpperCase() : ''}`, 'amount')}
          className="text-gray-600 font-medium hover:text-purple-800 transition-colors flex items-center"
        >
          {copyStatus.amount ? <CheckCircle className="h-5 w-5 mr-1" /> : <Copy className="h-5 w-5 mr-1" />}
          <span>{copyStatus.amount ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
    <div>
      <p className="text-gray-600 font-medium">Address</p>
      <div className="flex items-center justify-between bg-purple-100 rounded-md p-3">
        <span className="text-gray-800 break-all">{session.merchantId}</span>
        <button
          onClick={() => copyToClipboard(session.merchantId, 'address')}
          className="text-gray-600 font-medium hover:text-purple-800 transition-colors flex items-center"
        >
          {copyStatus.address ? <CheckCircle className="h-5 w-5 mr-1" /> : <Copy className="h-5 w-5 mr-1" />}
          <span>{copyStatus.address ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  </div>
);

const WalletConnection = ({ walletConnected, selectedToken, handlePayment, paymentStatus }) => (
  <div className="flex flex-col items-center justify-center mt-6">
    {!walletConnected ? (
      <ConnectWallet
        style={{
          backgroundColor: selectedToken ? '#6B21A8' : '#D3B4FC',
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
          width: '100%',
        }}
        showThirdwebBranding={false}
        modalSize={'compact'}
      />
    ) : (
      <button
        onClick={handlePayment}
        disabled={!selectedToken || paymentStatus === 'processing'}
        className={`w-full py-3 px-4 rounded-md font-bold text-white flex items-center justify-center ${
          selectedToken && paymentStatus !== 'processing' ? 'bg-purple-800 hover:bg-purple-700' : 'bg-purple-300 cursor-not-allowed'
        } transition-colors duration-200`}
      >
        {paymentStatus === 'processing' ? (
          <>
            <Loader className="animate-spin h-5 w-5 mr-2" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pay
          </>
        )}
      </button>
    )}
  </div>
);

export default Payment;