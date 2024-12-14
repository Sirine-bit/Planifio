import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MainMenu from './pages/MainMenu.jsx'; 
import './App.css';
import { AuthProvider, useAuth } from './helpers/wrapper.jsx';
import Modal from 'react-modal';
import LoadingScreen from './components/LoadingScreen.jsx';
import RequestHoliday from './pages/HolidaysRequestAndAbsences.jsx';

Modal.setAppElement('#root');
// Wrap protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />; // Or a spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Protected Routes - Nested under MainMenu */}
          <Route 
            path="/mainmenu" 
            element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            }
          >
            <Route path='*' element={<Navigate to="/mainmenu" replace />} />
          </Route>

          <Route 
            path="/RequestHoliday" 
            element={
              <ProtectedRoute>
                <RequestHoliday />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/mainmenu" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;