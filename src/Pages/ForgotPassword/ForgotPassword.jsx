// src/Components/ForgotPassword/ForgotPassword.js
import React, { useState } from 'react';
import './ForgotPassword.css';  // Import the CSS

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      // API request to send the forgot password email
      const response = await fetch('http://localhost:5006/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setMessage('Password reset email sent. Please check your inbox.');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error sending reset email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <h2 className="login-title">Forgot Password</h2>

          {message && <p className="message">{message}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <button type="submit" className="btn-primary-fp" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </form>

          <a href="/login" className="register-now">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
