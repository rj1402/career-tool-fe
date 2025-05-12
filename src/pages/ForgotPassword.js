import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLoginPage.css'; // using same styles as login
import logo from '../assests/Frame.png';
import forgotImage from '../assests/forgot.png'; // Replace later

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={forgotImage} alt="Forgot Password" />
        <p className="login-left-text">All-In-One #EverythingSkills Ecosystem.</p>
      </div>

      <div className="login-right">
        <img src={logo} alt="Logo" className="login-logo" />

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Forgot password</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
            Enter your email address and we will send you a link to get back into your account.
          </p>

          {error && <p className="error">{error}</p>}
          {message && <p style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">Send Login Link</button>
          <p
            style={{ textAlign: 'center', marginTop: '15px', color: '#9b59b6', cursor: 'pointer' }}
            onClick={() => navigate('/user-login')}
          >
            Back to Login
          </p>
        </form>
      </div>

      <div className="login-footer">
      © 2025 Ninzarin, All rights reserved Terms, Privacy Policy
      </div>
    </div>
  );
};

export default ForgotPassword;
