import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create AuthContext
const AuthContext = createContext(null);

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
});

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Set user and authentication state
      setUser(response.data.user);
      setIsAuthenticated(true);
      setAssignments(response.data.assignments);

      return response.data;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setAssignments([]);
  };

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    
    const verifyToken = async () => {
      if (token) {
        try {
          // You'll need a backend route to verify the token
          const response = await axiosInstance.get('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setUser(response.data.user);
          setIsAuthenticated(true);
          setAssignments(response.data.assignments);
        } catch (error) {
          // Token is invalid or expired
          //logout();
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
        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.request.eject(interceptor);
  }, []);

  // Create a protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>; // Or a spinner
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
      assignments,
      setAssignments,
      ProtectedRoute,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};