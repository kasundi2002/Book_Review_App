import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Book Store. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
