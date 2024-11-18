import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignupPage.css'; 
import { FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="signup-container">
      <div className="signup-card shadow p-4 rounded-lg">
        {/* Logo */}
        <div className="logo-container text-center mb-4">
          <img src="/assets/logo.png" alt="Planifio Logo" className="logo" />
        </div>

        {/* Title */}
        <h2 className="text-center mb-4">Login to Your Planifio</h2>

        {/* Login Form */}
        <form>
          <div className="form-group">
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Your Email or Name"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter Your Password"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        {/* Signup Link */}
        <p className="text-center mt-3">
          Or <Link to="/signup">Sign Up</Link> if you don't have an account
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
