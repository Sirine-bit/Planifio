import React, { useState, useEffect, useRef } from "react";
import "./MainMenu.css";
import { FaChartPie, FaGear, FaGears, FaPerson, FaRightFromBracket } from "react-icons/fa6";
import { FaHome, FaCalendar, FaComments, FaBell, FaChartLine, FaChevronLeft, FaChevronRight, FaUser } from 'react-icons/fa';
import { PiFacebookLogoDuotone } from "react-icons/pi";
import { useNavigate, Link, Outlet } from 'react-router-dom';

const MainMenu = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMyStaffMenu, setShowMyStaffMenu] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [highlightedDates] = useState([5, 16, 25, 27]);
  const navigate = useNavigate();
  // Create refs for the menu containers
  const profileRef = useRef(null);
  const myStaffRef = useRef(null);

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

  return (
    <div className="main-menu">
      <header className="main-menu-header">
        <div className="logo">
          <img src="/assets/logo.png" alt="Planifio Logo" />
          <span className="logo-text">planifio</span>
        </div>
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
              <button onClick={toggleMyStaffMenu}><FaChartPie /> My staff</button>

              {showMyStaffMenu && (
                <ul className="profile-menu">
                  <li>
                    <Link to="myassignments">My Assignments</Link>
                  </li>
                  <li>
                    <Link to="myschedule">My Schedule</Link>
                  </li>
                  <li>
                    <Link to="holidaysrequestandabsences">
                      Holidays Request and Absences
                    </Link>
                  </li>
                </ul>
              )}
            </li>
              <Outlet />
          </ul>
        </nav>
        <div className="profile-section" ref={profileRef}>
          <img
            src="/assets/profile.png"
            alt="Profile"
            className="profile-img"
            onClick={toggleProfileMenu}
          />
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
          <div className="assignments-list">
            <div className="assignment-item completed">
              <input type="checkbox" checked readOnly />
              <span>view mails</span>
            </div>
            <div className="assignment-item">
              <input type="checkbox" />
              <span>meeting at 10:30</span>
            </div>
            <div className="assignment-item">
              <input type="checkbox" />
              <span>prepare documents</span>
            </div>
          </div>
        </div>
      </div>
      <Outlet />

    </div>
    
  );
};

export default MainMenu;