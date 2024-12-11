import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Homepage from './Components/Homepage/Homepage.jsx'; // Ensure path and file name is correct
import Login from './Components/Login/Login.jsx';         // Ensure path and file name is correct
import SignUp from './Components/SignUp/Signup.jsx';     // Ensure path and file name is correct

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
