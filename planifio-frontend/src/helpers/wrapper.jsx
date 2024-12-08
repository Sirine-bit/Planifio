import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from './axios_config';
import LoadingScreen from '../components/LoadingScreen';
import PropTypes from 'prop-types';

// Create AuthContext
const AuthContext = createContext(null);
// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [organizationMembers, setOrganizationMembers] = useState([]);

  function setStates(data) {
    setUser(data.user);
    setIsAuthenticated(true);
    setAssignments(data.assignments);
    setProjects(data.projects);
    setOrganizationMembers(data.organizationMembers);
    console.log(data);
  }

  function _clearStates() {
    setUser(null);
    setIsAuthenticated(false);
    setAssignments([]);
    setProjects([]);
    setOrganizationMembers([]);
  }
  
  // Login function
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/login', { email, password });
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      setStates(response.data);
      return response.data;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    _clearStates();
  };

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const verifyToken = async () => {
      if (token) {
        try {
          // You'll need a backend route to verify the token
          const response = await axiosInstance.get('/api/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setStates(response.data);
        } catch (error) {
          // Token is invalid or expired
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  // AxiosInstance interceptor to add token to requests
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(Error(error));
      }
    );

    return () => axiosInstance.interceptors.request.eject(interceptor);
  }, []);

  // Create a protected route component
  const ProtectedRoute = ({ children, loading, isAuthenticated }) => {
    if (loading) {
      return <LoadingScreen />;
    }

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return null;
    }

    return children;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      organizationMembers,
      setOrganizationMembers,
      assignments,
      setAssignments,
      projects,
      setProjects,
      loading
    }}>
      {children}
      <ProtectedRoute loading={loading} isAuthenticated={isAuthenticated}>
        {children}
      </ProtectedRoute>
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};