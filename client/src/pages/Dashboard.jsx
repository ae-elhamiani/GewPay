import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Home, Store, RefreshCcw, Search, Download, ChevronDown, Menu, Bell, Globe, User, Zap, DollarSign, ShoppingCart, TrendingUp, Users, Sun, Moon, Cloud } from 'lucide-react';



const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);




  const chartColors = isDarkMode ? ['#8B5CF6', '#EC4899'] : ['#8B5CF6', '#EC4899'];

  const areaChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
    },
    colors: chartColors,
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      labels: {
        style: { colors: isDarkMode ? '#CBD5E0' : '#4A5568' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: isDarkMode ? '#CBD5E0' : '#4A5568' }
      }
    },
    tooltip: {
      x: { format: 'dd/MM/yy HH:mm' },
      theme: isDarkMode ? 'dark' : 'light'
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: isDarkMode ? '#CBD5E0' : '#4A5568' }
    },
    grid: {
      borderColor: isDarkMode ? '#2D3748' : '#E2E8F0',
      strokeDashArray: 5,
    },
    theme: { mode: isDarkMode ? 'dark' : 'light' }
  };

  const areaChartSeries = [
    {
      name: 'USD e-com',
      data: [50, 210, 180, 150, 90, 75, 100, 45]
    },
    {
      name: 'Digital product',
      data: [20, 130, 100, 80, 300, 250, 150, 190]
    }
  ];

  const pieChartOptions = {
    chart: {
      type: 'donut',
      animations: {
        speed: 500,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      },
    },
    colors: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B'],
    labels: ['Digital product', 'USD e-com', 'Hanouty', 'Others'],
    legend: {
      position: 'bottom',
      labels: { colors: isDarkMode ? '#CBD5E0' : '#4A5568' }
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        return opts.w.config.series[opts.seriesIndex] + '%'
      },
      style: {
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 400,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: { show: true },
            value: {
              show: true,
              fontSize: '22px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              formatter: (val) => `$${val}`
            },
            total: {
              show: true,
              label: 'Total',
              formatter: (w) => {
                return `$${w.globals.seriesTotals.reduce((a, b) => a + b, 0)}`
              }
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { height: 300 },
        legend: { position: 'bottom' }
      }
    }],
    theme: { mode: isDarkMode ? 'dark' : 'light' }
  };

  const pieChartSeries = [43, 27, 16, 14];

  const clientData = [
    { id: '0x0234234', email: 'gmail@gmail.com', orders: 8000, volume: 130, adsSpent: 9500, refunds: 13, color: '#8B5CF6' },
    { id: '0xk234rc4', email: 'gamma@gmail.com', orders: 3000, volume: 45, adsSpent: 4500, refunds: 18, color: '#EC4899' },
    { id: '0x0b342234', email: 'none', orders: 6000, volume: 80, adsSpent: 5800, refunds: 11, color: '#10B981' },
    { id: '0xr142234', email: 'gmail@om', orders: 4000, volume: 500, adsSpent: 4700, refunds: 18, color: '#F59E0B' },
    { id: '0x3r35g34', email: 'gmail.com', orders: 2000, volume: 15, adsSpent: 2500, refunds: 10, color: '#EF4444' },
  ];

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-50 via-white to-pink-50'} transition-colors duration-300`}>
      

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}

        {/* Main scrollable content */}
        <main className=  "flex-1 overflow-y-auto p-4 lg:p-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
          <div className="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="flex space-x-2">
              {['Transaction', 'Period'].map((item, index) => (
                <div key={index} className="relative">
<select className={`appearance-none ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm`}>
                    <option>{item}</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Find transaction"
                  className={`w-full pl-10 pr-4 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm`}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <button className={`flex items-center ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'} py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors duration-200 shadow-sm`}>
                <Download size={20} className="mr-2" />
                <span className="hidden lg:inline">Download</span>
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Volume Transaction Chart */}
         
          
          </div>
          
          {/* Top Client 2024 */}
          <div className={`mt-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 lg:p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01]`}>
            <h3 className="text-lg lg:text-xl font-semibold mb-4">Top Clients 2024</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <th className="py-2 px-4">Client</th>
                    <th className="py-2 px-4">Orders</th>
                    <th className="py-2 px-4">Volume</th>
                    <th className="py-2 px-4">Ads Spent</th>
                    <th className="py-2 px-4">Refunds</th>
                  </tr>
                </thead>
                <tbody>
                  {clientData.map((client, index) => (
                    <tr key={index} className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} hover:bg-gray-50 transition-colors duration-150`}>
                      <td className="py-3 px-4 flex items-center">
                        <div className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white font-bold" style={{backgroundColor: client.color}}>
                          {client.id.charAt(2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{client.id}</div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{client.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{client.orders.toLocaleString()}</td>
                      <td className="py-3 px-4">${client.volume.toLocaleString()}</td>
                      <td className="py-3 px-4">${client.adsSpent.toLocaleString()}</td>
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
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <span>Showing 5 of 5 clients</span>
              <div className="flex items-center space-x-2">
                <button className="px-2 py-1 rounded hover:bg-gray-200 transition-colors duration-200">Prev</button>
                <button className="px-2 py-1 bg-purple-600 text-white rounded">1</button>
                <button className="px-2 py-1 rounded hover:bg-gray-200 transition-colors duration-200">2</button>
                <button className="px-2 py-1 rounded hover:bg-gray-200 transition-colors duration-200">Next</button>
              </div>
            </div>
          </div>
        </main>       
      </div>
    </div>
  );
};

export default Dashboard;