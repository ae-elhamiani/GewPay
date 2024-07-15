// src/pages/WalletAuthh.js
import React from 'react';
import useWalletAuth from '../hooks/auth/useWalletAuth';

const WalletAuth = () => {
  const {
     isConnecting,
     error, 
     connectWallet, 
     handleInstallMetaMask, 
     address } =
    useWalletAuth();

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Connect wallet</h2>
      {address ? (
        <div className="text-green-600 font-semibold">
          <p>Wallet connected successfully: {address}</p>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          {isConnecting ? 'Connecting...' : 'Connect wallet'}
        </button>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="text-sm text-gray-600 mt-2">
        Don't have MetaMask?{' '}
        <a
          href="/"
          onClick={handleInstallMetaMask}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Install here
        </a>
      </p>
    </div>
  );
};

export default WalletAuth;
