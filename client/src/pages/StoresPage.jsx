import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Plus, Store, MoreVertical, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import CreateStoreModal from '../components/stores/CreateStoreModal';
import storeService from '../services/storeService';

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { isDarkMode } = useOutletContext();
  const navigate = useNavigate();

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const merchantId = localStorage.getItem('address');
      const response = await storeService.getMerchantStores(merchantId);
      setStores(response.data.map(store => ({
        id: store._id,
        name: store.storeName,
        incomeToday: parseFloat(store.todayStats.transactionVolume) / 1e18,
        totalTurnover: parseFloat(store.transactionVolume) / 1e18,
        status: store.status,
        transactionCount: store.transactionCount
      })));
    } catch (err) {
      console.error('Failed to fetch stores:', err);
      setError('Failed to load stores. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleCreateStore = async (newStore) => {
    try {
      const merchantId = localStorage.getItem('address');
      const response = await storeService.createStore(merchantId, newStore.name, newStore.tokens);
      const createdStore = {
        id: response.data._id,
        name: response.data.storeName,
        incomeToday: 0,
        totalTurnover: 0,
        status: 'NEW',
        transactionCount: 0
      };
      setStores(prevStores => [...prevStores, createdStore]);
      return createdStore;
    } catch (err) {
      console.error('Failed to create store:', err);
      throw err;
    }
  };

  const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);
  const handleStatusFilterChange = useCallback((e) => setStatusFilter(e.target.value), []);

  const filteredStores = useMemo(() =>
    stores.filter(store =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'All' || store.status === statusFilter)
    ),
    [stores, searchTerm, statusFilter]
  );

  const handleRowClick = (storeId) => {
    navigate(`/dashboard/${storeId}`);
  };

  return (
    <div className={`flex flex-col space-y-6 p-6 ${isDarkMode ? 'text-gray-100 bg-gray-900' : 'text-gray-800'}`}>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div className="flex space-x-2 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search stores..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`pl-10 pr-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              } border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="NEW">New</option>
            <option value="API KEY ..">API Key ..</option>
          </select>
          <button
            onClick={fetchStores}
            className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
            } transition-colors duration-200`}
            title="Refresh stores"
          >
            <RefreshCw size={20} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
          </button>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className={`flex items-center ${
            isDarkMode
              ? 'bg-purple-700 text-white hover:bg-purple-600'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          } py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm`}
        >
          <Plus size={20} className="mr-2" />
          <span>Create Store</span>
        </button>
      </div>

      {error && (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'} flex items-center`}>
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className={`rounded-xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <table className="w-full">
            <thead className={isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`}>Name</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`}>Income for Today</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`}>Total Turnover</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`}>Status</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-purple-100'}`}>
              {filteredStores.map((store) => (
                <tr 
                  key={store.id} 
                  className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-50'} transition-colors cursor-pointer`}
                  onClick={() => handleRowClick(store.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Store className={`flex-shrink-0 h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{store.name}</div>
                        <div className="text-sm text-gray-500">{store.transactionCount} transactions</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{store.incomeToday.toFixed(4)} ETH</div>
                    <div className="text-xs text-green-500">
                      {store.totalTurnover > 0 
                        ? `+${((store.incomeToday / store.totalTurnover) * 100).toFixed(1)}%`
                        : '0%'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{store.totalTurnover.toFixed(4)} ETH</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      store.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      store.status === 'NEW' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {store.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className={`${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-900'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add your action for the MoreVertical button here
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateStoreModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateStore={handleCreateStore}
        isDarkMode={isDarkMode}
      />

    </div>
  );
};

export default StoresPage;