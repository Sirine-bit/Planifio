import React, { useState } from 'react';
import './CreateAssignment.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RequestHoliday = () => {
  const [formData, setFormData] = useState({
    description: '',
    startDate: null,
    endDate: null
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

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    if (!formData.startDate) {
      setError('Start date is required');
      return;
    }

    if (!formData.endDate) {
      setError('End date is required');
      return;
    }

    // Simulate API call
    console.log('Submitting holiday request:', formData);
    setSuccess(true);
    
    // Reset form after successful submission
    setTimeout(() => {
      setFormData({ description: '', startDate: null, endDate: null });
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="main-container">
      {/* Background div with the blur effect */}
      <div className="background-image"></div>
      <div className="signup-container">
        <div className="signup-card shadow-lg p-6 rounded-lg">
          {/* Logo */}
          <div className="logo-container text-center mb-6">
            <img src="/assets/logo.png" alt="Planifio Logo" className="logo w-16 h-16" />
          </div>

          <h1 className="form-title text-2xl font-bold mb-8">Request a Holiday</h1>
          <form onSubmit={handleSubmit} className="assignment-form space-y-6">
            <div className="form-group">
              <label className="form-label text-gray-600 font-medium">
                Add a description
              </label>
              <div className="input-wrapper">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter holiday description"
                  className="form-control description-input"
                />
              </div>
            </div>

            <div className="form-group grid grid-cols-2 gap-6">
              <div>
                <label className="form-label text-gray-600 font-medium">
                  Start Date
                </label>
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
                <label className="form-label text-gray-600 font-medium">
                  End Date
                </label>
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

            {error && (
              <div className="alert error">
                {error}
              </div>
            )}

            {success && (
              <div className="alert success">
                Holiday request submitted successfully!
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestHoliday;