import React, { useState } from "react";
import "./MainMenu.css";
import { FaHome, FaCalendar, FaComments, FaBell, FaChartLine, FaUsers, FaChevronLeft, FaChevronRight, FaChartBar } from 'react-icons/fa';
import { FaChartPie, FaMessage, FaRegMessage } from "react-icons/fa6";

const MainMenu = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMyStaffMenu, setShowMyStaffMenu] = useState(false);
  const [currentMonth] = useState("June");
  const [currentYear] = useState("2016");

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const toggleMyStaffMenu = () => {
    setShowMyStaffMenu(!showMyStaffMenu);
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
              <a href="/hey"><FaBell />Hey!</a>
            </li>
            <li>
              <a href="/activity"><FaChartLine />Activity</a>
            </li>
            <li>
              <button onClick={toggleMyStaffMenu}><FaChartPie />My staff</button>

              {showMyStaffMenu && (
                <ul className="dropdown-content">
                  <li>
                    <a href="/myassignments">My Assignments</a>
                  </li>
                  <li>
                    <a href="/myschedule">My Schedule</a>
                  </li>
                  <li>
                    <a href="/holidaysrequestandabsences">
                      Holidays Request and Absences
                    </a>
                  </li>
                </ul>
              )}
c
            </li>
          </ul>
        </nav>
        <div className="profile-section">
          <img
            src="/assets/profile.png"
            alt="Profile"
            className="profile-img"
            onClick={toggleProfileMenu}
          />
          {showProfileMenu && (
            <ul className="profile-menu">
              <li>
                <a href="/profile">View Profile</a>
              </li>
              <li>
                <a href="/settings">Settings</a>
              </li>
              <li>
                <a href="/logout">Log Out</a>
              </li>
            </ul>
          )}

        </div>
      </header>

      <div className="company-name">
        <h1>Company Name</h1>
      </div>

      <div className="action-buttons">
        <button className="make-project-btn">Make new project</button>
        <button className="invite-people-btn">Invite people</button>
      </div>

      <div className="main-content">
        <div className="schedule-section">
          <h2>Your schedule</h2>
          <div className="calendar">
            <div className="calendar-header">
              <FaChevronLeft className="calendar-nav" />
              <span>{currentMonth} {currentYear}</span>
              <FaChevronRight className="calendar-nav" />
            </div>
            <div className="calendar-grid">
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
                {/* First row */}
                <span></span>
                <span></span>
                <span></span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span className="highlighted">4</span>
                {/* Additional rows */}
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
                <span>11</span>
                {/* Continue with remaining dates */}
              </div>
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
    </div>
  );
};

export default MainMenu;