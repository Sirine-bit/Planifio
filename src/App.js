import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import MainMenu from './pages/MainMenu'; 
import LineUP from './pages/LineUP'; 
import Pings from './pages/Pings'; 
import MySchedule from './pages/MySchedule';
import Hey from './pages/Hey'; 
import Activity from './pages/Activity'; 
import MyAssignments from './pages/MyAssignments'; 
import HolidaysRequestAndAbsences from './pages/HolidaysRequestAndAbsences'; 
import MakeProject from './pages/MakeProject';
import InvitePeople from './pages/InvitePeople';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mainmenu" element={<MainMenu />} />
        <Route path="/lineup" element={<LineUP />} />
        <Route path="/pings" element={<Pings />} />
        <Route path="/hey" element={<Hey />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/myassignments" element={<MyAssignments />} />
        <Route path="/myschedule" element={<MySchedule />} />
        <Route path="/holidaysrequestandabsences" element={<HolidaysRequestAndAbsences />} />
        <Route path="/makeProject" element={<MakeProject />} />
        <Route path="/invitePeople" element={<InvitePeople />} />
      </Routes>
    </Router>
  );
};

export default App;
