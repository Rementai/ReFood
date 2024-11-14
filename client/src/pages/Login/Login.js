import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setMessageType('success');
      setTimeout(() => setMessage(null), 5000);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        dispatch(login());
        navigate('/', { state: { message: 'Logged in successfully!' } });
      } else {
        setMessage(data.error || 'Login failed');
        setMessageType('error');
      }
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="container">
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <div className="left-panel">
        <h2>Sign in</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="sign-in-button">LOG IN</button>
        </form>
      </div>
      <div className="right-panel">
        <h2>Hello, cook!</h2>
        <p>Create an account and start preparing dishes with us</p>
        <Link to="/signup">
          <button className="sign-up-button">SIGN UP</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
