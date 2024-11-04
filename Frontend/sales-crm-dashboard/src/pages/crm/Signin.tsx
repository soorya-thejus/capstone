// pages/SignIn.tsx
import React, { useState } from 'react';
import Topbar from '../../components/crm/Topbar';
import styles from '../../styles/crm/auth.module.css';
import { Link, useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError('');

    try {
      const response = await fetch('http://localhost:5007/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign in. Please check your credentials.');
      }

      const data = await response.json();
      // Store token or handle success here
      // For example, you might want to save the token to localStorage
      localStorage.setItem('token', data.token);

      // Redirect to the dashboard or another page after successful login
      navigate('/crm/dashboard'); // Use navigate to redirect
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <Topbar />
      <div className={styles.authContent}>
        <div className={styles.infoSection}>
          <h2>Welcome Back!</h2>
          <p>Sign in to manage your CRM and track your sales, leads, and more.</p>
        </div>
        <div className={styles.formSection}>
          <h2>Sign In</h2>
          {error && <p className={styles.error}>{error}</p>} {/* Display error message */}
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="submit">Sign In</button>
          </form>
          <p>Don't have an account? <Link to="/crm/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
