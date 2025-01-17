import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Homepage from './Components/Homepage/Homepage.jsx';
import Login from './Components/Login/Login.jsx';
import SignUp from './Components/SignUp/Signup.jsx';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword.jsx';  // Import the ForgotPassword component
import { Dashboard } from './Pages/Dashboard/Dashboard.jsx';

const App = () => {
  return (
    <Router>
      <ConditionalNavbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
};

const ConditionalNavbar = () => {
  const location = useLocation();
  const showNavbar = !['/dashboard', '/forgot-password'].includes(location.pathname); // Hide navbar on these pages
  
  return showNavbar ? <Navbar /> : null;
};

export default App;
