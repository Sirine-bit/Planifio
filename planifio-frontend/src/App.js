import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import MainMenu from './pages/MainMenu'; 
// import LineUP from './pages/LineUP'; 
// import Pings from './pages/Pings'; 
// import MySchedule from './pages/MySchedule';
// import Hey from './pages/Hey'; 
// import Activity from './pages/Activity'; 
import HolidaysRequestAndAbsences from './pages/HolidaysRequestAndAbsences'; 
import InvitePeople from './pages/InvitePeople';
import DashboardPage from './pages/DashboardPage';
import './App.css';
import { AuthProvider, useAuth } from './helpers/wrapper';
import Modal from 'react-modal';
import LoadingScreen from './components/LoadingScreen';
import RoboticsLearning from './components/robotics';

Modal.setAppElement('#root');
// Wrap protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />; // Or a spinner
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
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
          <Route path="/robotics" element={<RoboticsLearning />} />
          {/* Protected Routes - Nested under MainMenu */}
          <Route 
            path="/mainmenu" 
            element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            }
          >
            {/* Nested routes inside MainMenu */}
            {/* <Route path="lineup" element={<LineUP />} /> */}
            {/* <Route path="pings" element={<Pings />} /> */}
            {/* <Route path="hey" element={<Hey />} /> */}
            {/* <Route path="activity" element={<Activity />} /> */}
            <Route path="myschedule" element={<div>My Schedule Page</div>} />
            <Route 
              path="holidaysrequestandabsences" 
              element={<HolidaysRequestAndAbsences />} 
            />
            <Route path="invitePeople" element={<InvitePeople />} />
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;