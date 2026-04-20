import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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

  try {
    const res = await axios.get(
      `http://localhost:3001/users`
    );

    console.log("Response:", res.data);

    const user = res.data.find(u => u.email.toLowerCase() === formData.email.trim().toLowerCase() && u.password === formData.password.trim());

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/products");
      }
    } else {
      setError("Invalid email or password");
    }

  } catch (err) {
    console.error(err);
    setError("An error occurred during login. Please try again.");
  }
};

  return (
    <div className="login-container">
      <div className="container">
        <h2>Login Page</h2>

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

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
      </div>
    </div>
  );
};

export default Login;