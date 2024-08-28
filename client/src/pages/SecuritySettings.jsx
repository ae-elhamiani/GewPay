import React, { useState } from 'react';
import { Lock, Smartphone, Key } from 'lucide-react';

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordLastChanged, setPasswordLastChanged] = useState('2023-05-15');
  const [activeDevices, setActiveDevices] = useState([
    { id: 1, name: 'iPhone 12', lastActive: '2023-06-01 14:30' },
    { id: 2, name: 'MacBook Pro', lastActive: '2023-06-02 09:15' },
  ]);

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    // Here you would typically make an API call to update the user's 2FA settings
  };

  const handleChangePassword = () => {
    // Implement password change logic
    console.log('Change password clicked');
  };

  const handleRevokeDevice = (deviceId) => {
    setActiveDevices(activeDevices.filter(device => device.id !== deviceId));
    // Here you would typically make an API call to revoke the device's access
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Security Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Lock className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-semibold">Password</h2>
        </div>
        <p className="text-gray-600 mb-4">Last changed: {passwordLastChanged}</p>
        <button
          onClick={handleChangePassword}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Change Password
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Smartphone className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </p>
          <label className="switch">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={handleToggleTwoFactor}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Key className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-semibold">Active Devices</h2>
        </div>
        <ul className="space-y-4">
          {activeDevices.map(device => (
            <li key={device.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{device.name}</p>
                <p className="text-sm text-gray-600">Last active: {device.lastActive}</p>
              </div>
              <button
                onClick={() => handleRevokeDevice(device.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                Revoke Access
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SecuritySettings;