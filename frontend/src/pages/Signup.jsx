import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./../styles/Login.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    try {
      // Check if user already exists
      const checkRes = await axios.get(`http://localhost:3001/users?email=${formData.email.trim().toLowerCase()}`);
      if (checkRes.data.length > 0) {
        setError("User with this email already exists");
        return;
      }

      // Create new user
      const newUser = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
        role: "user"
      };

      const res = await axios.post(`http://localhost:3001/users`, newUser);

      if (res.status === 201) {
        alert("Account created successfully! Please login.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>

      <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Signup;