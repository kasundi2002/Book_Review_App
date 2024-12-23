import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminHomePage from './pages/AdminHomePage';
import Login from './components/Login';
import Register from './components/Register';
import CustomerHomePage from './pages/CustomerHomePage';
import SingleBookPage from './pages/SingleBookPage';
import AdminViewBookPage from './pages/AdminViewBookPage';

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
        <Route path="/adminViewBook/:id" element={<AdminViewBookPage />} />
        
        {/* customer route */}
        <Route path="/books/:id" element={<SingleBookPage />} />
        <Route path="/customerHome" element={<CustomerHomePage />} />
        {/* <Route path="/book/:id" element={<SingleBookPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
