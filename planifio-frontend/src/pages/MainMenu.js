import React, { useState, useEffect, useRef } from "react";
import "./MainMenu.css";
import { FaChartPie, FaGear, FaRightFromBracket, FaSquarePlus } from "react-icons/fa6";
import { FaHome, FaCalendar, FaComments, FaBell, FaChartLine, FaChevronLeft, FaChevronRight, FaUser } from 'react-icons/fa';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import Modal from 'react-modal';
import CreateAssignment from '../components/CreateAssignmentDialog';
import { useAuth } from '../helpers/wrapper';
import LoadingScreen from "../components/LoadingScreen";
import AssignmentList from "../components/myAssignments";
import { Avatar } from "../components/avatar";

const MainMenu = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMyStaffMenu, setShowMyStaffMenu] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [highlightedDates] = useState([5, 16, 25, 27]);
  const { user, assignments, setAssignments, isLoading } = useAuth();
  const navigate = useNavigate();
  // Create refs for the menu containers
  const profileRef = useRef(null);
  const myStaffRef = useRef(null);


  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] = useState(false);

  const openAddAssignmentModal = () => setIsAddAssignmentModalOpen(true);
  const closeAddAssignmentModal = () => setIsAddAssignmentModalOpen(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check for profile menu
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      // Check for my staff menu
      if (myStaffRef.current && !myStaffRef.current.contains(event.target)) {
        setShowMyStaffMenu(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const toggleMyStaffMenu = () => {
    setShowMyStaffMenu(!showMyStaffMenu);
  };
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const calendarDays = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push("");
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }
    
    return calendarDays;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const days = getDaysInMonth(currentDate);
  const handleMakeProject = () => {
    navigate('/makeProject');
  };

  const handleInvitePeople = () => {
    navigate('/invitePeople');
  };

  console.log(user);

  if(isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="main-menu">
      <header className="main-menu-header">
        <a className="logo cursor-pointer decoration-solid" href="/">
          <img src="/assets/logo.png" alt="Planifio Logo" />
          <span className="logo-text">Planifio</span>
        </a>
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <a href="/home"><FaHome /> Home</a>
            </li>
            <li>
              <a href="/lineup"><FaCalendar /> LineUp</a>
            </li>
            <li>
              <a href="/pings"><FaComments /> Pings</a>
            </li>
            <li>
              <a href="/hey"><FaBell /> Hey!</a>
            </li>
            <li>
              <a href="/activity"><FaChartLine /> Activity</a>
            </li>
            <li ref={myStaffRef}>
              <a onClick={toggleMyStaffMenu} className="cursor-pointer"><FaChartPie /> My staff</a>
              {showMyStaffMenu && (
                <ul className="profile-menu">
                  <li className="cursor-pointer">
                    <a onClick={openAddAssignmentModal} >
                      <FaSquarePlus/>
                      Add Assignment
                    </a>
                  </li>
                  <li className="cursor-pointer">
                    <Link to="myschedule">
                    <FaCalendar/>
                    My Schedule</Link>
                  </li>
                  <li className="cursor-pointer">
                    <Link to="holidaysrequestandabsences">
                      <FaCalendar/>
                      Holidays Request and Absences
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
        <div className="profile-section" ref={profileRef}>
          <a href="#" onClick={toggleProfileMenu}>
            <Avatar 
              imageUrl={user?.profileImage} 
              size="md"
              className="cursor-pointer hover:opacity-80"
            />
          </a>
          {showProfileMenu && (
            <ul className="profile-menu">
              <li>
                <a href="/profile"><FaUser/> View Profile</a>
              </li>
              <li>
                <a href="/settings"><FaGear/> Settings</a>
              </li>
              <li>
                <a href="/logout"><FaRightFromBracket/> Log Out</a>
              </li>
            </ul>
          )}
        </div>
      </header>

      <div className="company-name">
        <h1>Company Name</h1>
      </div>

      <div className="action-buttons">
        <button className="make-project-btn" onClick={handleMakeProject}>
          Make new project
        </button>
        <button className="invite-people-btn" onClick={handleInvitePeople}>
          Invite people
        </button>
      </div>

      <div className="main-content">
        <div className="schedule-section">
          <h2>Your schedule</h2>
          <div className="calendar">
            <div className="calendar-header">
              <FaChevronLeft className="calendar-nav" onClick={previousMonth} />
              <span>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
              <FaChevronRight className="calendar-nav" onClick={nextMonth} />
            </div>
            <div className="calendar-days">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
            <div className="calendar-dates">
              {days.map((day, index) => (
                <span
                  key={index}
                  className={`calendar-date ${highlightedDates.includes(day) ? 'highlighted' : ''} ${day === '' ? 'empty' : ''}`}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="assignments-section">
          <h2>Your assignments</h2>
          <AssignmentList assignments={assignments} setAssignments={setAssignments} />
        </div>
      </div>
      <Modal
        isOpen={isAddAssignmentModalOpen}
        onRequestClose={closeAddAssignmentModal}
        contentLabel="Create Assignment Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        onAfterClose={() => setAssignments}
      >
        <button className="close-btn" onClick={closeAddAssignmentModal}>
          &times;
        </button>
        <CreateAssignment onClose={closeAddAssignmentModal} />
      </Modal>
      
      <Outlet />
    </div>
    
  );
};

export default MainMenu;