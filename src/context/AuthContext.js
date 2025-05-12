// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  const loginUser = (token) => {
    localStorage.setItem('userToken', token);
    setUserToken(token);
  };

  const logoutUser = () => {
    localStorage.removeItem('userToken');
    setUserToken(null);
  };

  const loginAdmin = (token) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
  };
  return (
    <AuthContext.Provider
      value={{
        userToken,
        adminToken,
        loginUser,
        logoutUser,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
