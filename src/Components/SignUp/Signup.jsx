import React from 'react';
import './SignUp.css';

const Signup = () => {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-form-container">
          <form className="signup-form">
            <h2 className="signup-title">Sign Up</h2>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <div className="input-group">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" required>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
