import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
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
          <button type="submit" className="sign-in-button">SIGN IN</button>
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
