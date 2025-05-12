// src/pages/UserSignupPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLoginPage.css";
import logo from "../assests/Frame.png";
import signupImage from "../assests/Group.png";
import { useAuth } from "../context/AuthContext";

const UserSignup = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://career-tool.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        loginUser(data.token);
        navigate("/user-dashboard");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={signupImage} alt="Signup Illustration" />
      </div>
      <div className="login-right">
        <img src={logo} alt="Logo" className="login-logo" />
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Sign Up for Ninzarin</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
          <p style={{ marginTop: "10px" }}>
            Already have an account?{" "}
            <span
              style={{ color: "#4b7bec", cursor: "pointer" }}
              onClick={() => navigate("/user-login")}
            >
              Log In
            </span>
          </p>
        </form>
      </div>
      <div className="login-footer">
        © 2025 Ninzarin, All rights reserved Terms, Privacy Policy
      </div>
    </div>
  );
};

export default UserSignup;
