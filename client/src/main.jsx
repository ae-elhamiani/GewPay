import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ThirdwebProvider, ChainId  } from '@thirdweb-dev/react';
import { BrowserRouter } from 'react-router-dom';

const activeChainId = ChainId.Mainnet; // or whichever chain you want to use
const customTheme = {
  colors: {
    modalBg: "rgba(200, 199, 200, 0.15)", // #D0C7F7 with 85% opacity
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={activeChainId} theme={customTheme} clientId="ee041666e57751f9c8ecdd8526a88086"   >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThirdwebProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
