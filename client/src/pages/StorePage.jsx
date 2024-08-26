import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Key, Copy, RefreshCw, Link as LinkIcon, Check, AlertTriangle, Coins, Zap, Store } from 'lucide-react';
import { storeService } from '../services/storeService';
import { toast } from 'react-toastify';

const TabButton = ({ tab, activeTab, setActiveTab, isDarkMode }) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={`px-4 py-2 rounded-lg transition-colors text-sm ${
      activeTab === tab 
        ? isDarkMode ? 'bg-purple-700 text-white' : 'bg-purple-500 text-white'
        : isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    {tab}
  </button>
);

const ApiKeySection = ({ store, generateApiKey, regenerateApiKey, copyToClipboard, copiedField, isDarkMode }) => {
  const maskApiKey = (apiKey) => {
    if (!apiKey || typeof apiKey !== 'string') return 'Generating ... ';
    return `${apiKey.slice(0, 8)}***********************************${apiKey.slice(-8)}`;
  };

  return (
    <div className="flex items-center space-x-4">
      <Key className={`${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} size={20} />
      <div className="flex-grow">
        <p className="text-sm text-gray-500">Payment API key</p>
        {store.apiKey ? (
          <div className="flex items-center">
            <p className="font-medium mr-2">{maskApiKey(store.apiKey)}</p>
            <button 
              onClick={() => copyToClipboard(store.apiKey, 'apiKey')} 
              className={`${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-900'} mr-2`}
            >
              {copiedField === 'apiKey' ? 'Copied!' : <Copy size={16} />}
            </button>
            <button 
              onClick={regenerateApiKey} 
              className={`flex items-center ${
                isDarkMode
                  ? 'bg-purple-700 text-white hover:bg-purple-600'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              } py-1 px-2 rounded-lg transition-colors duration-200 shadow-sm text-xs`}
            >
              <RefreshCw size={12} className="mr-1" /> Regenerate
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <p className="text-yellow-500 flex items-center mr-2">
              <AlertTriangle className="mr-2" size={16} /> Not Generated
            </p>
            <button 
              onClick={generateApiKey} 
              className={`flex items-center ${
                isDarkMode
                  ? 'bg-purple-700 text-white hover:bg-purple-600'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              } py-1 px-2 rounded-lg transition-colors duration-200 shadow-sm text-xs`}
            >
              <Key size={12} className="mr-1" /> Generate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


const StorePage = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useOutletContext();
  const [copiedField, setCopiedField] = useState(null);
  const [activeTab, setActiveTab] = useState('API Integration');
  const [acceptedTokens, setAcceptedTokens] = useState([]);
  const [loadingTokens, setLoadingTokens] = useState(false);

  const fetchStoreData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await storeService.getStoreById(storeId);
      setStore(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching store data. Please try again later.');
      toast.error('Failed to fetch store data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const fetchAcceptedTokens = useCallback(async () => {
    if (!store) return;
    setLoadingTokens(true);
    try {
      const response = await storeService.getAcceptedTokens(store._id);
      setAcceptedTokens(response.data);
    } catch (err) {
      console.error('Failed to fetch accepted tokens:', err);
      toast.error('Failed to fetch accepted tokens');
    } finally {
      setLoadingTokens(false);
    }
  }, [store]);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  useEffect(() => {
    if (store && activeTab === 'Coins') {
      fetchAcceptedTokens();
    }
  }, [store, activeTab, fetchAcceptedTokens]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success('Copied to clipboard');
  };

  const generateApiKey = async () => {
    try {
      const response = await storeService.generateApiKey(storeId);
      setStore(prev => ({ ...prev, apiKey: response.data.apiKey }));
      toast.success('API key generated successfully');
    } catch (err) {
      toast.error('Failed to generate API key');
    }
  };

  const regenerateApiKey = async () => {
    try {
      const response = await storeService.rotateApiKey(storeId, store.apiKey);
      setStore(prev => ({ ...prev, apiKey: response.data.apiKey }));
      toast.success('API key regenerated successfully');
    } catch (err) {
      toast.error('Failed to regenerate API key');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  if (!store) return <div className="flex justify-center items-center h-screen">Store not found</div>;

  const tabs = ['API Integration', 'Payment Accuracy', 'Coins'];

  return (
    <div className={`flex flex-col space-y-6 p-6 ${isDarkMode ? 'text-gray-100' : ' text-gray-800'}`}>
      <Link to="/dashboard/stores" className="flex items-center text-purple-500 hover:text-purple-600 mb-2">
        <ArrowLeft className="mr-2" /> Back to Stores
      </Link>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Store className={`flex-shrink-0 h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'} mr-3`} />
          <h1 className="text-2xl font-bold">{store.storeName}</h1>
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          store.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
          store.status === 'NEW' ? 'bg-yellow-100 text-yellow-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {store.status}
        </span>
      </div>

      <div className="flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <TabButton key={tab} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} />
        ))}
      </div>

      <div className={`rounded-xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6 space-y-6">
          {activeTab === 'API Integration' && (
            <>
              <div className="flex items-center space-x-4">
                <LinkIcon className={`${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} size={20} />
                <div>
                  <p className="text-sm text-gray-500">Blockchain Store ID</p>
                  <p className="font-medium">{store.blockchainStoreId}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Check className={`${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} size={20} />
                <div className="flex-grow">
                  <p className="text-sm text-gray-500">Store ID</p>
                  <div className="flex items-center">
                    <p className="font-medium mr-2">{store._id}</p>
                    <button 
                      onClick={() => copyToClipboard(store._id, 'storeId')} 
                      className={`${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-900'}`}
                    >
                      {copiedField === 'storeId' ? 'Copied!' : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <ApiKeySection 
                store={store}
                generateApiKey={generateApiKey}
                regenerateApiKey={regenerateApiKey}
                copyToClipboard={copyToClipboard}
                copiedField={copiedField}
                isDarkMode={isDarkMode}
              />
            </>
          )}

          {activeTab === 'Payment Accuracy' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Payment Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <h3 className="text-lg font-medium text-purple-600">Income Today</h3>
                  <p className="text-2xl font-bold">${(store.todayStats.transactionVolume / 1e18).toFixed(4)} ETH</p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <h3 className="text-lg font-medium text-purple-600">Total Income</h3>
                  <p className="text-2xl font-bold">${(store.transactionVolume / 1e18).toFixed(4)} ETH</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                <h3 className="text-lg font-medium text-purple-600">Transaction Count</h3>
                <p className="text-2xl font-bold">{store.transactionCount}</p>
              </div>
            </div>
          )}

          {activeTab === 'Coins' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Supported Tokens</h2>
              {loadingTokens ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {acceptedTokens.map((token) => (
                    <div key={token.addressToken} className={`flex items-center space-x-2 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                      <img src={token.logo} alt={token.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <span className="font-medium">{token.symbol}</span>
                        <p className="text-xs text-gray-500">{token.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className={`flex items-center ${
                isDarkMode
                  ? 'bg-purple-700 text-white hover:bg-purple-600'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              } py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm`}>
                <Zap className="mr-2" size={20} /> Add New Token
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorePage;