import React, { useState, useEffect, useCallback } from 'react';
import { Camera, Check, X } from 'lucide-react';
import '@regulaforensics/vp-frontend-face-components';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '800px',
  bgcolor: '#fff',
  border: 'none',
  boxShadow: 'none',
  padding: '20px',
  borderRadius: '15px',
  overflow: 'hidden',
};

const SelfieCapture = ({ onCapture, isDarkMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelfieCapture, setIsSelfieCapture] = useState(false);

  const applyCustomStyles = useCallback(() => {
    const component = document.querySelector('face-liveness');
    if (component && component.shadowRoot) {
      let style = component.shadowRoot.querySelector('#custom-styles');
      if (!style) {
        style = document.createElement('style');
        style.id = 'custom-styles';
        component.shadowRoot.appendChild(style);
      }
      style.textContent = `
        * {
          box-shadow: none !important;
        }
        .container {
          border-radius: 15px;
          overflow: hidden;
        }
        .close-button {
          display: none !important;
        }
      `;
    }
  }, []);

  const applySettings = useCallback(() => {
    const component = document.querySelector('face-liveness');
    if (component) {
      component.settings = {
        closeDisabled: true,
        customization: {
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '15px',
          onboardingScreenStartButtonBackground: isDarkMode ? '#9333ea' : '#9333ea',
          onboardingScreenStartButtonBackgroundHover: isDarkMode ? '#E3CEF4' : '#7E22CE',
          onboardingScreenStartButtonTitle: '#FFF',
          onboardingScreenStartButtonTitleHover: '#FFFFFF',
          cameraScreenFrontHintLabelBackground: isDarkMode ? '#E3CEF4' : '#E3CEF4',
          cameraScreenFrontHintLabelText: isDarkMode ? '#E5E7EB' : '#9333ea',
          cameraScreenSectorActive: isDarkMode ? '#9333ea' : '#9333ea',
          cameraScreenSectorTarget: isDarkMode ? '#E3CEF4' : '#E3CEF4',
          cameraScreenStrokeNormal: isDarkMode ? '#9333ea' : '#9333ea',
          processingScreenProgress: isDarkMode ? '#9333ea' : '#9333ea',
          retryScreenRetryButtonBackground: isDarkMode ? '#7E22CE' : '#9333ea',
          retryScreenRetryButtonBackgroundHover: isDarkMode ? '#7e22ce' : '#D6CEF8',
          retryScreenRetryButtonTitle: '#FFFFFF',
          retryScreenRetryButtonTitleHover: '#FFFFFF',
          retryScreenEnvironment: 'none',
        },
      };
    }
  }, [isDarkMode]);

  const handleCapture = useCallback((event) => {
    if (event.detail?.data?.status === 1) {
      const base64Image = event.detail.data.response.images[0];
      const blob = base64ToBlob(base64Image, 'image/jpeg');
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      onCapture(file);
      setIsSelfieCapture(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 10);
    }
  }, [onCapture]);

  useEffect(() => {
    if (isModalOpen) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            const component = document.querySelector('face-liveness');
            if (component) {
              applySettings();
              applyCustomStyles();
              component.addEventListener('face-liveness', handleCapture);
            }
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        const component = document.querySelector('face-liveness');
        if (component) {
          component.removeEventListener('face-liveness', handleCapture);
        }
      };
    }
  }, [isModalOpen, applySettings, applyCustomStyles, handleCapture]);

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md mb-4`}>
      <h3 className={`text-lg font-semibold mb-2 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <Camera className={`mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} size={20} />
        Vérifiez votre identité par un selfie check
      </h3>
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center justify-center px-4 py-2 ${
            isDarkMode
              ? 'bg-purple-700 text-white hover:bg-purple-600'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          } rounded-lg transition-colors duration-200`}
        >
          <Camera size={18} className="mr-2" />
          Prendre mon selfie
        </button>
        {isSelfieCapture && (
          <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'} flex items-center`}>
            <Check size={16} className="mr-1" />
            Selfie capturé avec succès !
          </p>
        )}
      </div>

      <Modal
        className='modal-liveness-signup'
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        disableAutoFocus
      >
        <Box sx={modalStyle}>
          <button 
            onClick={() => setIsModalOpen(false)}
            className={`absolute top-4 right-4 z-50 ${
              isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'
            } focus:outline-none`}
          >
            <X size={24} />
          </button>
          <face-liveness></face-liveness>
        </Box>
      </Modal>
    </div>
  );
};

export default SelfieCapture;