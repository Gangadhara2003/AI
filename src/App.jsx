import React, { useState, useEffect } from 'react'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar'
import Main from './components/Main/Main'
import LandingPage from './components/LandingPage/LandingPage'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Settings from './components/Settings/Settings'
import { useAuth } from './context/AuthContext';
import HelpContent from './components/Help/HelpContent';

const App = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 600);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
      const handleResize = () => {
          const mobile = window.innerWidth <= 600;
          setIsMobile(mobile);
          setShowSidebar(!mobile);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    logout();
  };

  const handleStartChat = () => {
    if (userInfo) {
      navigate('/home');
    } else {
      window.alert("Please login to start chat.");
      navigate('/login');
    }
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LandingPage onStartChat={handleStartChat} onLogin={handleLoginClick} />} />
        <Route
          path="/home"
          element={
            userInfo ? (
              <div className="app-container">
                {(showSidebar || !isMobile) && <Sidebar onLogout={handleLogoutClick} showSidebar={showSidebar} setShowSidebar={setShowSidebar} isMobile={isMobile} setShowHelp={setShowHelp} />}
                <Main isMobile={isMobile} setShowSidebar={setShowSidebar} />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            userInfo ? (
              <div className="app-container">
                {(showSidebar || !isMobile) && <Sidebar onLogout={handleLogoutClick} showSidebar={showSidebar} setShowSidebar={setShowSidebar} isMobile={isMobile} setShowHelp={setShowHelp} />}
                <Settings isMobile={isMobile} setShowSidebar={setShowSidebar} />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
      {showHelp && <HelpContent onClose={() => setShowHelp(false)} />}
    </>
  )
}

export default App