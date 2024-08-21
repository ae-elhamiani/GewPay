import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, Check, Loader, ShoppingBag, Coins, Zap, AlertCircle, Globe, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storeService } from '../../services/storeService';
import useStoreCreation from '../../hooks/store/useStoreCreation';

const STEPS = {
  INPUT: 'input',
  CREATING: 'creating',
  SUCCESS: 'success',
  ERROR: 'error'
};

const useTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [error, setError] = useState('');

  const fetchTokens = useCallback(async () => {
    setIsLoadingTokens(true);
    try {
      const response = await storeService.getTokens();
      setTokens(response.data);
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
      setError('Failed to load tokens. Please try again.');
    } finally {
      setIsLoadingTokens(false);
    }
  }, []);

  return { tokens, isLoadingTokens, error, fetchTokens };
};

const TokenSelector = React.memo(({ tokens, selectedTokens, toggleToken, isDarkMode, isLoadingTokens }) => {
  if (isLoadingTokens) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="animate-spin " size={24} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2">
      {tokens.map(token => (
        <div
          key={token.addressToken}
          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
            selectedTokens.find(t => t.addressToken === token.addressToken)
              ? isDarkMode ? 'bg-purple-900 border-purple-500' : 'bg-purple-100 border-purple-500'
              : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
          }`}
          onClick={() => toggleToken(token)}
        >
          <img src={token.logo} alt={token.name} className="w-8 h-8 mr-3" />
          <span className="text-sm font-medium">{token.symbol}</span>
          {selectedTokens.find(t => t.addressToken === token.addressToken) && (
            <Check className="ml-auto text-purple-500" size={20} />
          )}
        </div>
      ))}
    </div>
  );
});

const CreateStoreModal = ({ isOpen, onClose, onCreateStore, isDarkMode }) => {
  const [step, setStep] = useState(STEPS.INPUT);
  const [storeName, setStoreName] = useState('');
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [newStoreId, setNewStoreId] = useState(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const { tokens, isLoadingTokens, error: tokensError, fetchTokens } = useTokens();
  const { createStore, isLoading: isCreatingStore, error: createStoreError } = useStoreCreation();

  useEffect(() => {
    if (isOpen) fetchTokens();
  }, [isOpen, fetchTokens]);

  useEffect(() => {
    if (!isOpen) {
      setStoreName('');
      setSelectedTokens([]);
      setStep(STEPS.INPUT);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (storeName.trim() && selectedTokens.length > 0) {
      setStep(STEPS.CREATING);
      try {
        const storeId = await createStore(storeName, selectedTokens);
        onCreateStore({ id: storeId, name: storeName, tokens: selectedTokens });
        setNewStoreId(storeId);
        setStep(STEPS.SUCCESS);
      } catch (error) {
        console.error('Failed to create store:', error);
        setStep(STEPS.ERROR);
      }
    }
  };

  const toggleToken = useCallback((token) => {
    setSelectedTokens(prev => 
      prev.find(t => t.addressToken === token.addressToken) 
        ? prev.filter(t => t.addressToken !== token.addressToken) 
        : [...prev, token]
    );
  }, []);

  const handleGoToSetup = () => {
    onClose();
    if (newStoreId) navigate(`/dashboard/${newStoreId}`);
  };

  const nextSteps = useMemo(() => [
    { icon: Globe, title: 'Connect WooCommerce', desc: 'Install the GwePay plugin on your WooCommerce store.' },
    { icon: Key, title: 'Generate API Key', desc: 'Create an API key in your GwePay dashboard for secure connection.' },
    { icon: ShoppingBag, title: 'Configure Store', desc: 'Set up payment methods and customize your checkout process.' },
    { icon: Zap, title: 'Go Live', desc: 'Activate your store and start accepting crypto payments!' },
  ], []);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (step) {
      case STEPS.INPUT:
        return (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium mb-2">
                  Enter a store name
                </label>
                <input
                  type="text"
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className={`w-full p-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Store name"
                  required
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Select tokens (at least one):</p>
                <TokenSelector 
                  tokens={tokens}
                  selectedTokens={selectedTokens}
                  toggleToken={toggleToken}
                  isDarkMode={isDarkMode}
                  isLoadingTokens={isLoadingTokens}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!storeName.trim() || selectedTokens.length === 0}
              className={`w-full mt-4 py-2 rounded-lg font-semibold transition-colors ${
                isDarkMode
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-purple-500 hover:bg-purple-600'
              } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Create Store
            </button>
          </form>
        );
      case STEPS.CREATING:
        return (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader className="animate-spin mb-4" size={48} />
            <p>Creating your store...</p>
          </div>
        );
      case STEPS.SUCCESS:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Congratulations!</h3>
            <p className="text-gray-600 mb-6">
              Your store "{storeName}" has been successfully created!
            </p>
            <div className="space-y-4 text-left mb-6">
              {nextSteps.map(({ icon: Icon, title, desc }, index) => (
                <div key={index} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-semibold flex items-center text-lg">
                    <Icon size={20} className="mr-2 text-purple-500" />
                    {title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">{desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleGoToSetup}
              className={`w-full py-2 rounded-lg font-semibold ${
                isDarkMode
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-purple-500 hover:bg-purple-600'
              } text-white transition-colors duration-200`}
            >
              Go to setup
            </button>
          </div>
        );
      case STEPS.ERROR:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Oops!</h3>
            <p className="text-gray-600 mb-6">{tokensError || createStoreError}</p>
            <button
              onClick={() => setStep(STEPS.INPUT)}
              className={`w-full py-2 rounded-lg font-semibold ${
                isDarkMode
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-purple-500 hover:bg-purple-600'
              } text-white transition-colors duration-200`}
            >
              Try Again
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed -inset-8 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div 
        ref={modalRef}
        className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-3xl w-[480px] shadow-2xl overflow-hidden flex flex-col`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">
            {step === STEPS.SUCCESS ? 'Congratulations!' : 'Create new store'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 flex-grow overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CreateStoreModal;