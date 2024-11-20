import React, { useState } from 'react';
import './CreateAssignment.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MakeProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    team: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleDateChange = (field, date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('project name is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    // Simulate API call
    console.log('Submitting project:', formData);
    setSuccess(true);

    // Reset form after successful submission
    setTimeout(() => {
      setFormData({ name: '', description: '', startDate: null, endDate: null, team: '' });
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
          <h2 className="form-title">Make a new project</h2>
          <form onSubmit={handleSubmit} className="assignment-form">
            <div className="form-group">
              <label className="form-label">Name this project</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Add a description</label>
              <div className="input-wrapper">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter project description"
                  className="form-control description-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Choose who's on the project</label>
              <div className="input-wrapper">
                <textarea
                  type="text"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  placeholder="Enter team"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group grid grid-cols-2 gap-6">
              <div>
                <label className="form-label text-gray-600 font-medium">When the project start</label>
                <div className="input-wrapper relative">
                  <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <DatePicker
                    name="startDate"
                    selected={formData.startDate}
                    onChange={(date) => handleDateChange('startDate', date)}
                    placeholderText="Enter start date"
                    className="form-control pl-10"
                    dateFormat="MM/dd/yyyy"
                  />
                </div>
              </div>
              <div>
                <label className="form-label text-gray-600 font-medium">When the project end</label>
                <div className="input-wrapper relative">
                  <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <DatePicker
                    name="endDate"
                    selected={formData.endDate}
                    onChange={(date) => handleDateChange('endDate', date)}
                    placeholderText="Enter end date"
                    className="form-control pl-10"
                    dateFormat="MM/dd/yyyy"
                  />
                </div>
              </div>
            </div>

            {error && <div className="alert error">{error}</div>}

            {success && <div className="alert success">Project created successfully!</div>}

            <button type="submit" className="btn-primary">
              Add project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeProject;
