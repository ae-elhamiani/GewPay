import React, { useState, useCallback, useMemo } from 'react';
import { Search, Download, ChevronDown } from 'lucide-react';
import ClientTable from '../components/ClientTable';
import FilterSelect from '../components/FilterSelect';
import SearchInput from '../components/SearchInput';

const Dashboard = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('All');
  const [periodFilter, setPeriodFilter] = useState('All Time');

  const clientData = useMemo(() => [
    // { id: '0x0234234', email: 'gmail@gmail.com', orders: 8000, volume: 130, adsSpent: 9500, refunds: 13, color: '#8B5CF6' },
    // { id: '0xk234rc4', email: 'gamma@gmail.com', orders: 3000, volume: 45, adsSpent: 4500, refunds: 18, color: '#EC4899' },
    // { id: '0x0b342234', email: 'none', orders: 6000, volume: 80, adsSpent: 5800, refunds: 11, color: '#10B981' },
    // { id: '0xr142234', email: 'gmail@om', orders: 4000, volume: 500, adsSpent: 4700, refunds: 18, color: '#F59E0B' },
    // { id: '0x3r35g34', email: 'gmail.com', orders: 2000, volume: 15, adsSpent: 2500, refunds: 10, color: '#EF4444' },
  ], []);

  const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);
  const handleTransactionFilterChange = useCallback((e) => setTransactionFilter(e.target.value), []);
  const handlePeriodFilterChange = useCallback((e) => setPeriodFilter(e.target.value), []);

  const filteredClients = useMemo(() => 
    clientData.filter(client => 
      client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [clientData, searchTerm]
  );

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div className="flex space-x-2">
          <FilterSelect 
            options={['All', 'Completed', 'Pending', 'Cancelled']} 
            value={transactionFilter} 
            onChange={handleTransactionFilterChange}
            label="Transaction"
          />
          <FilterSelect 
            options={['All Time', 'This Week', 'This Month', 'This Year']} 
            value={periodFilter} 
            onChange={handlePeriodFilterChange}
            label="Period"
          />
        </div>
        <div className="flex space-x-2">
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Find transaction"
          />
          <button className="flex items-center bg-white text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-sm">
            <Download size={20} className="mr-2" />
            <span className="hidden lg:inline">Download</span>
          </button>
        </div>
      </div>
      <ClientTable clients={filteredClients} isDarkMode={isDarkMode} />
    </div>
  );
};

export default Dashboard;