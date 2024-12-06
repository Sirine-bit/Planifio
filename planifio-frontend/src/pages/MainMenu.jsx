import React, { useState, useEffect, useRef } from "react";
import "./MainMenu.css";
import { FaChartPie, FaSquarePlus } from "react-icons/fa6";
import { FaHome, FaCalendar, FaComments, FaBell, FaChartLine, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import CreateAssignment from '../components/CreateAssignmentDialog';
import { useAuth } from '../helpers/wrapper';
import LoadingScreen from "../components/LoadingScreen.jsx";
import AssignmentList from "../components/myAssignments.jsx";
import { Avatar } from "../components/avatar.jsx";
import ProjectModal from "../components/ProjectModal.jsx";
import ChatModal from "../components/pings.jsx";
import NotificationDropdown from "../components/Notifications.jsx";
import InviteDialog from "../components/inviteCoworker.jsx";
import ProfileDropdown from "../components/ProfileView..jsx";

const MainMenu = () => {
  const [showMyStaffMenu, setShowMyStaffMenu] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  const [currentDate, setCurrentDate] = useState(new Date());
  const [highlightedDates] = useState([5, 16, 25, 27]);
  const { user, assignments, setAssignments, isLoading } = useAuth();
  
  // Create refs for the menu containers
  const myStaffRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const profileButtonRef = useRef(null);


  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  const openAddAssignmentModal = () => setIsAddAssignmentModalOpen(true);
  const closeAddAssignmentModal = () => setIsAddAssignmentModalOpen(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
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

  const handleInvitePeople = () => {
    setIsInviteDialogOpen(true);
  };

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
              <a href="/" className="cursor-pointer"><FaHome /> Home</a>
            </li>
            <li>
              <a href="/lineup"><FaCalendar /> LineUp</a>
            </li>
            <li>
              <button onClick={() => setIsChatOpen(true)} className="aligned-button">
                <FaComments /> Pings
              </button>
              <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            </li>
            <li>
              <button 
                ref={notificationButtonRef}
                data-notification-trigger="true"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
                className="aligned-button"
              >
                <FaBell /> Hey!
              </button>
              <NotificationDropdown 
                isOpen={isNotificationOpen} 
                onClose={() => setIsNotificationOpen(false)}
                anchor={notificationButtonRef}
              />
            </li>
            <li>
              <a href="/activity"><FaChartLine /> Activity</a>
            </li>
            <li ref={myStaffRef}>
              <button onClick={toggleMyStaffMenu} className="aligned-button">
                <FaChartPie />
                <div>My staff</div>
              </button>
              {showMyStaffMenu && (
                <ul className="profile-menu">
                  <li className="cursor-pointer">
                    <button onClick={openAddAssignmentModal} className="aligned-button" >
                      <FaSquarePlus/>
                      <div>Add Assignment</div>
                    </button>
                  </li>
                  <li className="cursor-pointer">
                    <Link to="MySchedule">
                    <FaCalendar/>
                    My Schedule</Link>
                  </li>
                  <li className="cursor-pointer">
                    <Link to="HolidaysRequest">
                      <FaCalendar/>
                      Holidays Request and Absences
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
        <div className="profile-section" ref={profileButtonRef}>
          <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <Avatar 
              imageUrl={user?.profileImage || "../assets/avatar.png"} 
              size="md"
              className="cursor-pointer hover:opacity-80"
            />
          </button>
          <ProfileDropdown 
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              anchor={profileButtonRef}
          />
        </div>
      </header>

      <div className="company-name">
        <h1>Company Name</h1>
      </div>

      <div className="action-buttons">
        <ProjectModal isOpen={isAddProjectOpen} onClose={() => setIsAddProjectOpen(false)} />
        <button className="make-project-btn" onClick={() => setIsAddProjectOpen(true)}>
          Create Project
        </button>
        <button className="invite-people-btn" onClick={handleInvitePeople}>
          Invite people
        </button>
        <InviteDialog 
          isOpen={isInviteDialogOpen} 
          onClose={() => setIsInviteDialogOpen(false)} 
        />
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
                  key={`${currentDate.getMonth()}-${day}-${index}`}
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
    </div>
    
  );
};

export default MainMenu;