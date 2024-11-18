import React, { useState } from "react";
import "./MainMenu.css";

const MainMenu = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMyStaffMenu, setShowMyStaffMenu] = useState(false);

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
          <span>Planifio</span>
        </div>
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <a href="/lineup">LineUP</a>
            </li>
            <li>
              <a href="/pings">Pings</a>
            </li>
            <li>
              <a href="/hey">Hey!</a>
            </li>
            <li>
              <a href="/activity">Activity</a>
            </li>
            <li className="dropdown">
              <span onClick={toggleMyStaffMenu}>My Staff</span>
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

      {/* Section des boutons centrés */}
      <div className="action-buttons">
        <button className="create-project-btn">Create Project</button>
        <button className="invite-users-btn">Invite Users</button>
      </div>

      <section className="info-section">
        <h2>Notifications</h2>
        <ul className="notifications-list">
          <li>You have 3 new messages.</li>
          <li>Your schedule has been updated.</li>
          <li>New holiday request approved.</li>
        </ul>
      </section>
    </div>
  );
};

export default MainMenu;
