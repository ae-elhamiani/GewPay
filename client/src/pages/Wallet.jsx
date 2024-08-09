import React, { useEffect } from 'react';
import { ConnectWallet } from '@thirdweb-dev/react';
import useWalletAuth from '../hooks/auth/useWalletAuth';
import '../styles/styles.css';
import CardData from '../components/Profile/CardData';
import { useNavigate } from 'react-router-dom';

function Wallet() {
  const { error, address, signNonce, signature, connectWallet } =
    useWalletAuth();

    const navigate= useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        {!address ? (
          <>
            <h1 className="text-5xl font-bold mb-4">
              Connect your wallet to get started!
            </h1>
            {/* <h2 className="text-xl font-bold mb-4">Select your WEB3 wallet</h2> */}
            <ConnectWallet
              showThirdwebBranding={false}
              modalSize={'compact'}
              className="connect-wallet-button"
              onClick={connectWallet}
            />
          </>
        ) : (
          <div className="text-blue-600 font-semibold">
            <button
              onClick={ navigate('/profile')}
              className="w-full bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Sign Nonce
            </button>
            {signature && (
              <div>
                <h3>Signature:</h3>
                <p>{signature}</p>
              </div>
            )}
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </header>
    </div>
  );
}

export default Wallet;
