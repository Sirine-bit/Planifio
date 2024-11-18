import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignupPage.css';
import { FaUser, FaEnvelope, FaBuilding, FaLock } from 'react-icons/fa';

const SignupPage = () => {
  return (
    <div className="signup-container">
      <div className="signup-card shadow p-4 rounded-lg">
        {/* Logo */}
        <div className="logo-container text-center mb-4">
          <img src="/assets/logo.png" alt="Planifio Logo" className="logo" />
        </div>

        {/* Title */}
        <h2 className="text-center mb-4">Join Planifio</h2>

        {/* Signup Form */}
        <form>
          <div className="form-group">
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Your Name"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Your Email"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-wrapper">
              <FaBuilding className="input-icon" />
              <input
                type="text"
                className="form-control"
                id="organization"
                placeholder="Organization Name"
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
                placeholder="Password"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
