import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminHomePage from './pages/AdminHomePage';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect default route to login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Login and Register routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin route */}
        <Route path="/adminHome" element={<AdminHomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
