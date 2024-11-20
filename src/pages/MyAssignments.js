import React, { useState } from 'react';
import './CreateAssignment.css';

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Assignment name is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    // Simulate API call
    console.log('Submitting assignment:', formData);
    setSuccess(true);
    
    // Reset form after successful submission
    setTimeout(() => {
      setFormData({ name: '', description: '' });
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
          <h2 className="form-title">Create Assignment</h2>
          <form onSubmit={handleSubmit} className="assignment-form">
            <div className="form-group">
              <label className="form-label">
                Assignment name
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter assignment name"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Description
              </label>
              <div className="input-wrapper">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter assignment description"
                  className="form-control description-input"
                />
              </div>
            </div>

            {error && (
              <div className="alert error">
                {error}
              </div>
            )}

            {success && (
              <div className="alert success">
                Assignment created successfully!
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary"
            >
              Add Assignment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;