import React from 'react';
import { Outlet } from 'react-router-dom';
import logo from '../../assets/GwePay.svg';
import Whale from '../common/Whale';

const Layout = () => (
  <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
    <header className="w-full px-16 py-16 flex justify-start">
      <img src={logo} alt="GWEPAY" className="h-8" />
    </header>
    <main className="flex-grow flex items-center justify-between px-16 z-10">
      <div className="w-1/2 max-w-md">
        <Outlet />
      </div>
    </main>
    <Whale />
    <footer className="py-4 px-16 text-sm text-gray-500 z-10">
      Created by the Gwenod Team © 2024
    </footer>
  </div>
);

export default Layout;
