import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import WalletAuth from './pages/WalletAuth.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="Wallet-authentification" element={<WalletAuth />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
