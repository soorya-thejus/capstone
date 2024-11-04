// pages/SignUp.tsx
import React, { useState } from 'react';
import Topbar from '../../components/crm/Topbar';
import styles from '../../styles/crm/auth.module.css';
import { Link, useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Sales Rep', // Default role if not specified
    org_id: '', // If you need to capture organization ID
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5007/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Error occurred during sign-up');
      } else {
        // On successful registration, redirect to sign-in page
        navigate('/crm/signin');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <Topbar />
      <div className={styles.authContent}>
        <div className={styles.infoSection}>
          <h2>Join Us Today!</h2>
          <p>Sign up to take control of your business and streamline your sales process.</p>
        </div>
        <div className={styles.formSection}>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
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
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="Admin">Admin</option>
              <option value="Sales Rep">Sales Rep</option>
              <option value="Project Manager">Project Manager</option>
            </select>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
          <p>Already have an account? <Link to="/crm/signin">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
