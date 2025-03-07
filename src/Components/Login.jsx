import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
  .post("http://localhost:3000/auth/adminlogin", values)
  .then((result) => {
    if (result.data.loginStatus) {
      localStorage.setItem("userRole", result.data.role);
      localStorage.setItem("authToken", result.data.token);   // Save token
      
      // Redirect based on role
      if (result.data.role === "MD") {
          navigate("/md-dashboard");
      } else if (result.data.role === "admin") {
          navigate("/dashboard");
      } else if (result.data.role === "Accounts TL") {
          navigate("/accounts-dashboard");
      } else if (result.data.role === "Finance TL") {
          navigate("/finance-dashboard");
      } else if (result.data.role === "Procurement TL") {
          navigate("/procurement-dashboard");
      } else {
          navigate("/employee-dashboard");
      }
    } else {
      setError(result.data.Error);
    }
  })
  .catch((err) => console.error("❌ Login Error:", err));

  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <div className="text-warning">{error && error}</div>
        <h2>SSEV SOFT SOLS</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email:</strong></label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password:</strong></label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <button className="btn btn-success w-100 rounded-0 mb-2">Log in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
