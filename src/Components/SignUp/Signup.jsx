import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      localStorage.setItem('token', response.data.token); // Store the token
      alert('Signup successful!');
    } catch (error) {
      console.error(error);
      alert('Signup failed. Please try again!');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-form-container">
          <form className="signup-form" onSubmit={onSubmit}>
            <h2 className="signup-title">Sign Up</h2>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={onChange}
                required
              >
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