import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import { CSSTransition } from 'react-transition-group';
import { useAuth } from '../helpers/wrapper';
import './ProjectModal.css'; // Import CSS for transitions

const ProjectModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    teamMembers: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { organizationMembers } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create project');

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="modal"
      unmountOnExit
    >
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="max-w-2xl mx-auto mt-20 bg-white p-6 rounded-lg shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-2xl font-bold mb-4">New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1" htmlFor="Project Name">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1" htmlFor="Description">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1" htmlFor="Team Members">
              Team Members
            </label>
            <select
              multiple
              value={formData.teamMembers}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  teamMembers: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
              className="w-full border rounded p-2"
            >
              {organizationMembers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1" htmlFor="Start Date">
                Start Date
              </label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) =>
                  setFormData({ ...formData, startDate: date })
                }
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1" htmlFor="End Date">
                End Date
              </label>
              <DatePicker
                selected={formData.endDate}
                onChange={(date) =>
                  setFormData({ ...formData, endDate: date })
                }
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">Project created successfully!</div>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </CSSTransition>
  );
};

ProjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProjectModal;
