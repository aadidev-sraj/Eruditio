// src/Components/Login/Login.jsx
import React from 'react';
import './Login.css';


const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <form className="login-form">
            <h2 className="login-title">Login</h2>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
            <button type="submit" className="btn-primary">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
