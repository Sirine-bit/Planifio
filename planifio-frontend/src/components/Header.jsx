import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center">
        <img
          src="/assets/logo.png"
          alt="Planifio Logo"
          className="w-15 h-14 rounded-full"
        />
        <span className="text-2xl font-bold ml-2 mt-2">Planifio</span>
      </div>
      <div>
        <Link
          to="/login"
          className="text-lg text-gray-800 hover:text-blue-500 transition"
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default Header;
