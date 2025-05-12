// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import UserLoginPage from './pages/UserLoginPage';  
import UserDashboard from './pages/UserDashboard';  
import UserSignup from './pages/UserSignup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';  
import { useAuth } from './context/AuthContext';

function App() {
  const { userToken, adminToken } = useAuth();
  // const token = localStorage.getItem('adminToken');
  // const userToken = localStorage.getItem('userToken');

  return (
    <Router>
      <Routes>
        <Route
          path="/admin-login"
          element={adminToken ? <Navigate to="/admin-panel" /> : <AdminLogin />}
        />
        <Route
          path="/admin-panel"
          element={adminToken ? <AdminPanel /> : <Navigate to="/admin-login" />}
        />
        <Route
          path="/user-login"
          element={userToken ? <Navigate to="/user-dashboard" /> : <UserLoginPage />}
        />
        <Route
          path="/user-dashboard"
          element={userToken ? <UserDashboard /> : <Navigate to="/user-login" />}
        />
        <Route
          path="/user-signup"
          element={userToken ? <Navigate to="/user-dashboard" /> : <UserSignup />}
        />
        <Route
          path="/forgot-password"
          element={userToken ? <Navigate to="/user-login" /> : <ForgotPassword />}
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            userToken ? <Navigate to="/user-dashboard" /> : <UserSignup />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
