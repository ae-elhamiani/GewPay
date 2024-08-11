import React from 'react';
import { BarChart2 } from 'lucide-react';

const ClientTable = ({ clients, isDarkMode }) => (
  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 lg:p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01]`}>
    <h3 className={`text-lg lg:text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Top Clients 2024</h3>
    {clients.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <th className="py-2 px-4">Client</th>
              <th className="py-2 px-4">Orders</th>
              <th className="py-2 px-4">Volume</th>
              <th className="py-2 px-4">Ads Spent</th>
              <th className="py-2 px-4">Refunds</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={index} className={`border-t ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors duration-150`}>
                <td className="py-3 px-4 flex items-center">
                  <div className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white font-bold" style={{backgroundColor: client.color}}>
                    {client.id.charAt(2).toUpperCase()}
                  </div>
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{client.id}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{client.email}</div>
                  </div>
                </td>
                <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{client.orders.toLocaleString()}</td>
                <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>${client.volume.toLocaleString()}</td>
                <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>${client.adsSpent.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${client.refunds > 15 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {client.refunds > 15 ? '>' : '<'}{client.refunds}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <BarChart2 size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
        <h4 className="text-xl font-semibold mb-2">No Transactions Yet</h4>
        <p className="max-w-md mx-auto">
          Your transaction history is empty. As your clients make purchases, you'll see their activity here.
        </p>
      </div>
    )}
    <div className={`mt-4 flex justify-between items-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <span>Showing {clients.length} of {clients.length} clients</span>
      <div className="flex items-center space-x-2">
        <button className={`px-2 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors duration-200`}>Prev</button>
        <button className="px-2 py-1 bg-purple-600 text-white rounded">1</button>
        <button className={`px-2 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors duration-200`}>2</button>
        <button className={`px-2 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors duration-200`}>Next</button>
      </div>
    </div>
  </div>
);

export default ClientTable;