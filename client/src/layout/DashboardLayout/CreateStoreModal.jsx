import React, { useState } from 'react';
import { X } from 'lucide-react';

const mockTokens = [
  { id: '1', symbol: 'ETH', name: 'Ethereum' },
  { id: '2', symbol: 'USDT', name: 'Tether' },
  { id: '3', symbol: 'USDC', name: 'USD Coin' },
];

const CreateStoreModal = ({ isOpen, onClose, onCreateStore }) => {
  const [step, setStep] = useState(1);
  const [storeName, setStoreName] = useState('');
  const [selectedTokens, setSelectedTokens] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      onCreateStore({ name: storeName, tokens: selectedTokens });
      setStoreName('');
      setSelectedTokens([]);
      setStep(1);
      onClose();
    }
  };

  const toggleToken = (token) => {
    setSelectedTokens(prev => 
      prev.includes(token) ? prev.filter(t => t !== token) : [...prev, token]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create new store</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                Enter a store name
              </label>
              <input
                type="text"
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Store name"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select tokens (at least one)
              </label>
              {mockTokens.map(token => (
                <div key={token.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={token.id}
                    checked={selectedTokens.includes(token)}
                    onChange={() => toggleToken(token)}
                    className="mr-2"
                  />
                  <label htmlFor={token.id}>{token.name} ({token.symbol})</label>
                </div>
              ))}
            </div>
          )}
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {step === 1 ? 'Next' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStoreModal;