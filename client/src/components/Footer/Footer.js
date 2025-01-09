import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <h4>General</h4>
          <div className="links-columns">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/recipes">Recipes</a></li>
            </ul>
            <ul>
              <li><a href="/login">Log In</a></li>
              <li><a href="/signup">Sign Up</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
      <p className="footer-credits">© 2025 ReFood. Sebastian Mazgaj. Akademia Tarnowska.</p>
    </footer>
  );
};

export default Footer;
