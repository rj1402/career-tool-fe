import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLoginPage.css';
import logo from '../assests/Frame.png'; // adjust path as per your structure
import loginImage from '../assests/Group.png';      // adjust path as per your structure
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const UserLoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('https://career-tool.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        loginUser(data.token);
        // console.log('Login successful:', data);
        // localStorage.setItem('userToken', data.token); // assuming response has token
        navigate('/user-dashboard');
        // Redirect or handle auth logic here
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
      console.error(err);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('https://career-tool.onrender.com/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        loginUser(data.token);
        navigate('/user-dashboard');
      } else {
        setError(data.error || 'Google login failed');
      }
    } catch (err) {
      setError('Google login error');
      console.error(err);
    }
  };

  return (
    <div className="login-page-wrapper">
    {/* Global Logo */}
      <img src={logo} alt="Logo" className="global-login-logo" />
      <div className="login-container">
        <div className="login-left">
          <img src={loginImage} alt="Illustration" />
          <p className="login-left-text">The Future of Talent is #EverythingSkills</p>
        </div>
        <div className="login-right">
          {/* <img src={logo} alt="Logo" className="login-logo" /> */}
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Welcome To Ninzarin</h2>
            {error && <p className="error">{error}</p>}
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Log In</button>
            <p className="forgot-password" onClick={() => navigate('/forgot-password')}>Forgot password?</p>
            <div className="google-login">
              <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => setError("Google login failed")} />
            </div>
          </form>
        </div>
        <div className="login-footer">
        © 2025 Ninzarin, All rights reserved Terms, Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
