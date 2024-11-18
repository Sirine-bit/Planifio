// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="home-container">
      <Header />
      <main className="hero-section">
        <div className="hero-content">
          <h1>the only work management platform designed to assess according to your needs</h1>
          <p>With planifio, set company-wide goals, manage strategic plans, and accomplish your work in the same place.</p>
          <button onClick={handleGetStarted} className="cta-button">Get Started</button>
        </div>
        <div className="hero-image">
          <img src={`${process.env.PUBLIC_URL}/assets/team-image.jpg`} alt="Team Collaboration" />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
