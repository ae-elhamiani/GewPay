import React from 'react';
import { ConnectWallet } from '@thirdweb-dev/react';
import useWalletAuth from "../hooks/auth/useWalletAuth";
import "../styles/styles.css";
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';


function Wallet() {
  const { error, address, isMerchant, connectWallet, connectionStatus } = useWalletAuth();

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold mb-5">
          Connect your wallet to get started!
        </h1>
      
        <div className="relative bg-opacity-45 backdrop-blur-sm shadow-xl p-8 overflow-hidden bg-violet-200 rounded-2xl shadow-lg p-8 max-w-md w-full">
          <p className="text-gray-600 mb-4">Please connect your wallet</p>
          {connectionStatus !== "connected" ? (
            <ConnectWallet
            showThirdwebBranding={false}
            modalSize={'compact'}
            className="connect-wallet-button"
            onClick={connectWallet}
          />
    
        ) : (
          <div className={`p-4 rounded-md mb-2 ${isMerchant ? 'bg-violet-50' : 'bg-violet-50'}`}>
            {isMerchant ? (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-violet-400 mr-3" />
                <p className="text-sm font-medium text-violet-800">
                  Merchant wallet connected successfully
                </p>
              </div>
            ) : (
              <div className="p-4  bg-violet-50">

              {!error ? (
                <div className="flex items-center">
                  <Loader className="h-5 w-5 text-violet-600 mr-3 animate-spin" />
                  <p className="text-sm font-medium text-violet-600">
                    Registering as merchant...
                  </p>
                </div>
              ) : (
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-violet-600 mr-3" />
                    <p className="text-sm font-medium text-violet-600">{error}</p>
                  </div>
               
              )}
             </div>
          
            )}
          </div>
        )}

       
         
          {!address && (
            <p className="text-sm text-gray-600 mt-4">
              Don't have a Web3 wallet?{' '}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Install MetaMask
              </a>
            </p>
          )}
        </div>
      </header>
    </div>
  );
}

export default Wallet;