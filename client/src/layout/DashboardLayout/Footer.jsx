import React from 'react';

const Footer = ({ isDarkMode }) => (
  <footer className={`${isDarkMode ? 'text-white' : 'text-gray-600'} py-4 px-6`}>
    <p className="text-center">&copy; 2024 Gwepay. All rights reserved.</p>
  </footer>
);

export default Footer;