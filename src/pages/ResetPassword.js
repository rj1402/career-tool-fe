import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import resetImage from "../assests/reset.png";
import logo from "../assests/Frame.png";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post(`http://51.20.73.229/api/auth/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });

      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/user-login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={resetImage} alt="illustration" className="login-image" />
        <p className="login-text">
          <strong>Hire Smarter & Upskill Faster to Optimize Performance</strong>
        </p>
      </div>

      <div className="login-right">
        <img src={logo} alt="Logo" className="login-logo" />
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-heading">Reset Password</h2>
          <p className="login-subheading">
            Enter a new password and confirm it to reset your account access.
          </p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <input
            type="password"
            placeholder="New Password"
            className="login-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="login-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Save Password
          </button>
        </form>
      </div>
      <div className="login-footer">
        © 2025 Ninzarin, All rights reserved Terms, Privacy Policy
      </div>
    </div>
  );
};

export default ResetPassword;
