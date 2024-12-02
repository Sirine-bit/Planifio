import React from 'react';
import { Link } from 'react-router-dom'; 
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src="/assets/logo.png" alt="Planifio Logo" className="logo" />
        <span className="brand-name">Planifio</span>
      </div>
      <div className="login-link">
        <Link to="/login">Login</Link> 
      </div>
    </header>
  );
};

export default Header;
