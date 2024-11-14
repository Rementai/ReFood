import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null); // State for message
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, first_name: firstName, last_name: lastName, email, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        navigate('/login', { state: { message: 'Registration successful! You can now log in.' } });
      } else {
        const errors = data.errors ? Object.values(data.errors).join(' ') : 'Registration failed';
        setMessage(errors);
        setMessageType('error');
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (error) {
      setMessage('Signup error');
      setMessageType('error');
      console.error('Signup error:', error);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="signup-container">
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <div className="signup-left-panel">
        <h2>Already a user?</h2>
        <p>Log in to your account</p>
        <Link to="/login">
          <button className="signup-login-button">LOG IN</button>
        </Link>
      </div>
      <div className="signup-right-panel">
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
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
          <button type="submit" className="signup-submit-button">SIGN UP</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
