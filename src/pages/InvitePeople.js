import React, { useState } from 'react';
import './CreateAssignment.css';

const InvitePeople = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    job: '',
    company: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation des champs
    if (!formData.fullname.trim()) {
      setError('Full name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!formData.job.trim()) {
      setError('Job title is required');
      return;
    }

    if (!formData.company.trim()) {
      setError('Company is required');
      return;
    }

    // Simuler un appel API
    console.log('Submitting Email invitation:', formData);
    setSuccess(true);

    // Réinitialiser le formulaire après un succès
    setTimeout(() => {
      setFormData({ fullname: '', email: '', job: '', company: '' });
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="main-container">
      <div className="background-image"></div>
      <div className="signup-container">
        <div className="signup-card shadow p-4 rounded-lg">
          {/* Logo */}
          <div className="logo-container text-center mb-4">
            <img src="/assets/logo.png" alt="Planifio Logo" className="logo" />
          </div>
          <h2 className="form-title">Set up your coworker's account</h2>
          <form onSubmit={handleSubmit} className="assignment-form">
            {/* Nom complet */}
            <div className="form-group">
              <label className="form-label">Full name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="form-control"
                />
              </div>
            </div>
            {/* Adresse email */}
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="form-control"
                />
              </div>
            </div>
            {/* Poste occupé */}
            <div className="form-group">
              <label className="form-label">Job title</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  placeholder="Enter job title"
                  className="form-control"
                />
              </div>
            </div>
            {/* Société */}
            <div className="form-group">
              <label className="form-label">Company / Organisation</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company/organisation"
                  className="form-control"
                />
              </div>
            </div>

            {/* Message d'erreur */}
            {error && <div className="alert error">{error}</div>}

            {/* Message de succès */}
            {success && <div className="alert success">Invitation sent successfully!</div>}

            {/* Bouton soumettre */}
            <button type="submit" className="btn-primary">
              Email invitation now...
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvitePeople;
