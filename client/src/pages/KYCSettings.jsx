import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { Upload, Trash2, CreditCard, MapPin, Home } from 'lucide-react';
import SelfieCapture from '../components/kyc/SelfieCapture';

const KYCVerification = () => {
  const context = useOutletContext();
  const isDarkMode = context?.isDarkMode ?? false;

  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addressDiffers, setAddressDiffers] = useState(false);
  const [addressProof, setAddressProof] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (setter) => (e) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleFileDelete = (setter) => () => setter(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    if (idFront) formData.append('idFront', idFront);
    if (idBack) formData.append('idBack', idBack);
    if (selfie) formData.append('selfie', selfie);
    if (addressDiffers && addressProof) {
      formData.append('addressProof', addressProof);
    }

    try {
      await axios.post('/api/kyc/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setIsLoading(false);
      console.error('Error submitting KYC verification:', error);
    }
  };

  const FileUploadCard = ({ title, file, onChange, onDelete, icon: Icon }) => (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md mb-4`}>
      <h3 className={`text-lg font-semibold mb-2 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <Icon className={`mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} size={20} />
        {title}
      </h3>
      <div className={`border-2 border-dashed ${isDarkMode ? 'border-gray-600' : 'border-purple-300'} rounded-lg p-4 text-center`}>
        {file ? (
          <div className="flex justify-between items-center">
            <span className={`flex items-center ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}>
              <Upload size={16} className="mr-2" />
              {file.name}
            </span>
            <button onClick={onDelete} className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}>
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <input type="file" onChange={onChange} accept="image/*" className="hidden" />
            <Upload size={24} className={`mx-auto ${isDarkMode ? 'text-purple-400' : 'text-purple-500'} mb-2`} />
            <span className={`${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}>Choose file</span>
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col  p-6 ${isDarkMode ? 'bg-gray-900 text-gray-100' : ' text-gray-800'}`}>
      <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'} `}>KYC Verification</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadCard
            title="ID Front"
            file={idFront}
            onChange={handleFileChange(setIdFront)}
            onDelete={handleFileDelete(setIdFront)}
            icon={CreditCard}
          />
          <FileUploadCard
            title="ID Back"
            file={idBack}
            onChange={handleFileChange(setIdBack)}
            onDelete={handleFileDelete(setIdBack)}
            icon={CreditCard}
          />
        </div>
        
        <SelfieCapture isDarkMode={isDarkMode} onCapture={setSelfie} />
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md`}>
          <h3 className={`text-lg font-semibold mb-2 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <MapPin className={`mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} size={20} />
            Address Verification
          </h3>
          <p className={`mb-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Is your residence address different from the one on your ID?</p>
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={addressDiffers}
                onChange={(e) => setAddressDiffers(e.target.checked)}
                className={`form-checkbox h-5 w-5 ${isDarkMode ? 'text-purple-400 border-gray-600' : 'text-purple-600 border-gray-300'}`}
              />
              <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Yes, my address is different</span>
            </label>
          </div>
          {addressDiffers && (
            <FileUploadCard
              title="Address Proof"
              file={addressProof}
              onChange={handleFileChange(setAddressProof)}
              onDelete={handleFileDelete(setAddressProof)}
              icon={Home}
            />
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 ${
            isDarkMode
              ? 'bg-purple-700 text-white hover:bg-purple-600'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          } rounded-lg transition-colors duration-200 shadow-sm text-lg font-semibold ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Submitting...' : 'Submit KYC Verification'}
        </button>
      </form>
    </div>
  );
};

export default KYCVerification;