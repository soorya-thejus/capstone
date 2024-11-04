// pages/SignIn.tsx
import React, { useState } from 'react';
import Topbar from '../../components/crm/Topbar';
import styles from '../../styles/crm/auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5007/api/auth/login', {
        ...formData,
      });

      if (response.status === 200) {
        // Store user information in session storage
        const { token, user } = response.data;
        console.log();
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userId', user.id);
        sessionStorage.setItem('orgId', user.org_id);
        sessionStorage.setItem('username', user.username);
        sessionStorage.setItem('role', user.role);
        // Navigate to the dashboard
        navigate('/crm/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <Topbar />
      <div className={styles.authContent}>
        <div className={styles.infoSection}>
          <h2>Welcome Back!</h2>
          <p>Log in to access your account.</p>
        </div>
        <div className={styles.formSection}>
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
          <p>Don't have an account? <Link to="/crm/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
