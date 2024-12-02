import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignupPage.css';
import { FaUser, FaEnvelope, FaBuilding, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Gestion des champs de formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche la soumission par défaut du formulaire
  
    try {
      // Envoi de la requête POST
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Spécifie que les données sont envoyées en JSON
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password,
          organization: formData.organization
        }),
      });
  
      // Vérification de la validité de la réponse
      if (!response.ok) {
        const data = await response.json(); // Récupère le message d'erreur depuis la réponse
        throw new Error(data.message || 'Error creating account'); // Lance une erreur si la réponse n'est pas OK
      }
  
      // Si l'inscription est réussie
      const data = await response.json();
      alert('Account created successfully!');
      navigate('/login'); // Redirige l'utilisateur vers la page de connexion
  
    } catch (err) {
      setError(err.message); // Affiche l'erreur si elle se produit
    }
  };
  
  return (
    <div className="main-container">
      <div className="background-image"></div>
      <div className="signup-container">
        <div className="signup-card shadow p-4 rounded-lg">
          <div className="logo-container text-center mb-4">
            <img src="/assets/logo.png" alt="Planifio Logo" className="logo" />
          </div>
          <h2 className="text-center mb-4">Join Planifio</h2>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.organization}
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
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Create Account
            </button>
          </form>
          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
