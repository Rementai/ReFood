import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        alert(data.message);
        navigate('/');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
};

  return (
    <div className="container">
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
