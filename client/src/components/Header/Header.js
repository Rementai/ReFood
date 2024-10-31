import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUtensils, FaUser, FaSearch } from 'react-icons/fa';
import './Header.css';
import ReFoodLogo from '../../images/Refood.jpg';

const Header = () => {
  const location = useLocation();
  const currentPage = location.pathname;
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <div className="logo">
            <Link to="/">
              <img src={ReFoodLogo} alt="Logo" />
            </Link>
          </div>
        </div>

        <div className="header-right">
          <Link to="/signup" className={`nav-item sign-up-link ${currentPage === '/signup' ? 'active' : ''}`}>
            SIGN UP
          </Link>
          <Link to="/" className={`nav-item ${currentPage === '/' ? 'active' : ''}`}>
            <FaHome className="icon" />
            <span>Home</span>
          </Link>
          <Link to="/recipes" className={`nav-item ${currentPage === '/recipes' ? 'active' : ''}`}>
            <FaUtensils className="icon" />
            <span>Recipes</span>
          </Link>
          <Link to="/login" className={`nav-item ${currentPage === '/login' ? 'active' : ''}`}>
            <FaUser className="icon" />
            <span>Log in</span>
          </Link>
        </div>
      </div>

      <div className="header-bottom">
        <div className="search-bar-container">
          <FaSearch className={`search-icon ${isSearchActive ? 'active' : ''}`} />
          <input
            type="text"
            placeholder="Search recipes"
            className="search-bar"
            onFocus={() => setIsSearchActive(true)}
            onBlur={() => setIsSearchActive(false)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
