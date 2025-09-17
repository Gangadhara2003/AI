import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    // Get user info from localStorage on initial load
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      return storedUserInfo ? JSON.parse(storedUserInfo) : null;
    } catch (error) {
      console.error('Failed to parse user info from localStorage', error);
      return null;
    }
  });

  const navigate = useNavigate();

  // Function to handle user login
  const login = (data) => {
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    navigate('/home'); // Redirect to home page after login
  };

  // Function to handle user logout
  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
    navigate('/'); // Redirect to root path after logout
  };

  // Function to handle user update
  const updateUser = (data) => {
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
