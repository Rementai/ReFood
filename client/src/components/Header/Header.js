import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaHome, FaUtensils, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { logout } from '../../store/authSlice'
import SearchBar from '../SearchBar/SearchBar';
import './Header.css';
import ReFoodLogo from '../../images/Refood.jpg';

const Header = () => {
  const location = useLocation();
  const currentPage = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);  
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

        <div className="hamburger-menu" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={`header-right ${isMenuOpen ? 'open' : ''}`}>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="nav-item sign-up-link logout-button">
              Log out
            </button>
          ) : (
            <Link to="/signup" className={`nav-item sign-up-link ${currentPage === '/signup' ? 'active' : ''}`}>
              SIGN UP
            </Link>
          )}
          <Link to="/" className={`nav-item ${currentPage === '/' ? 'active' : ''}`}>
            <FaHome className="icon" />
            <span>Home</span>
          </Link>
          <Link to="/recipes" className={`nav-item ${currentPage === '/recipes' ? 'active' : ''}`}>
            <FaUtensils className="icon" />
            <span>Recipes</span>
          </Link>
          {isLoggedIn ? (
            <Link to="/profile" className={`nav-item ${currentPage === '/profile' ? 'active' : ''}`}>
              <FaUser className="icon" />
              <span>Profile</span>
            </Link>
          ) : (
            <Link to="/login" className={`nav-item ${currentPage === '/login' ? 'active' : ''}`}>
              <FaUser className="icon" />
              <span>Log in</span>
            </Link>
          )}
        </div>
      </div>

      <div className="header-bottom">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
