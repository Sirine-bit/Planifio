import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Avatar } from '../components/avatar.jsx';
import axiosInstance from '../helpers/axios_config';
import PropTypes from 'prop-types';

const NotificationDropdown = ({ isOpen, onClose, anchor }) => {
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          !event.target.closest('button[data-notification-trigger="true"]')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await axiosInstance.put(`/api/notifications/${notificationId}/click`);
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, isClicked: true }
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as clicked:', error);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getDropdownPosition = () => {
    if (!anchor?.current) return {};
    const rect = anchor.current.getBoundingClientRect();
    return {
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`
    };
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="fixed z-50 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden"
      style={getDropdownPosition()}
    >
      <div className="p-3 border-b flex justify-between items-center bg-blue-600 text-white">
        <h2 className="text-lg font-semibold w-full text-[aliceBlue]">Notifications</h2>
        <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification._id)}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                notification.isClicked ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className='flex gap-2 items-center justify-center'>
                    {!notification.isClicked &&(
                        <div className="flex-shrink-0">
                            {getSeverityIcon(notification.severity)}
                        </div>
                        )
                    }
                    {notification.instigatorImage && (
                    <Avatar
                        imageUrl={notification.instigatorImage}
                        size="sm"
                        className="flex-shrink-0"
                    />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notification.isClicked ? 'text-gray-400' : 'text-black'}`}>
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

NotificationDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  anchor: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
};

export default NotificationDropdown;