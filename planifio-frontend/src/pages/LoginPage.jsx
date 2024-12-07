import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignupPage.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../helpers/wrapper';


const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/mainmenu');
    } catch (error) {
      // Handle login error
      setError(error.response?.data?.message || 'Error while connecting');
    }
    // try {
    //   const response = await fetch('http://localhost:5000/api/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(formData)
    //   });

    //   const data = await response.json();
    //   if (!response.ok) {
    //     throw new Error(data.message || 'Error while connecting');
    //   }

    //   alert('Connection successful !');
    //   navigate('/mainmenu'); // Remplace "/dashboard" par la page souhaitée
    // } catch (err) {
    //   setError(err.message);
    // }
  };

  return (
    <div className="main-container">
      <div className="background-image"></div>
      <div className="signup-container">
        <div className="signup-card shadow p-4 rounded-lg">
          <div className="logo-container text-center mb-4 w-full justify-center flex">
            <img src="/assets/logo.png" alt="Planifio Logo" className="logo" />
          </div>
          <h2 className="text-center mb-4">Login to Your Planifio</h2>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          <p className="text-center mt-3">
            Or <Link to="/signup" className='text-blue-500 hover:text-blue-600'>Sign Up</Link> if you don't have an account
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
