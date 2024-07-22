import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import WalletAuthh from './pages/WalletAuth';
import MoreInfo from './pages/MoreInfo'; // Create this component

import './index.css';

const App = () => {
  return (
    <div>
      <Router>
        <Routes >
          <Route path="/" element={<Layout />}>
          <Route path="Wallet-authentication" element={<WalletAuthh />} />
          <Route path="/more-info" element={<MoreInfo />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;