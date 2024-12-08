import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../helpers/wrapper';
import { Settings, LogOut, User, Briefcase, Users } from 'lucide-react';
import { Avatar } from '../components/avatar';
import PropTypes from 'prop-types';

const ProfileDropdown = ({ isOpen, onClose, anchor }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, projects, assignments, organizationMembers } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          !event.target.closest('button[data-profile-trigger="true"]')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getDropdownPosition = () => {
    if (!anchor?.current) return {};
    const rect = anchor.current.getBoundingClientRect();
    return {
      top: `${rect.bottom + window.scrollY}px`,
      right: `${window.innerWidth - rect.right - window.scrollX}px`
    };
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div 
      ref={dropdownRef}
      className="fixed z-50 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden"
      style={getDropdownPosition()}
    >
      {/* Header with user info */}
      <div className="p-4 bg-blue-600 text-white">
        <div className="flex items-center space-x-3">
          <Avatar
            imageUrl={user.profileImage}
            size="md"
            className="border-2 border-white"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold w-full text-start text-[aliceBlue] truncate">{user.username}</h2>
            <p className="text-sm text-blue-100 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-1 p-4 bg-gray-50 border-b">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700">{projects.length}</p>
          <p className="text-xs text-gray-500">Projects</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700">{assignments.length}</p>
          <p className="text-xs text-gray-500">Tasks</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700">{organizationMembers.length}</p>
          <p className="text-xs text-gray-500">Team</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-2">
        <button 
          onClick={() => handleNavigate('/profile')}
          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <User className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">View Profile</span>
        </button>

        <button 
          onClick={() => handleNavigate('/projects')}
          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Briefcase className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">My Projects</span>
        </button>

        <button 
          onClick={() => handleNavigate('/team')}
          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Users className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">Team Members</span>
        </button>

        <button 
          onClick={() => handleNavigate('/settings')}
          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">Settings</span>
        </button>

        <div className="my-2 border-t"></div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </nav>
    </div>
  );
};

ProfileDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  anchor: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
};

export default ProfileDropdown;