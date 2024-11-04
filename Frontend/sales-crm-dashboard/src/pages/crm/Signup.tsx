// pages/SignUp.tsx
import React, { useState } from 'react';
import Topbar from '../../components/crm/Topbar';
import styles from '../../styles/crm/auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    username: '',
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
      const response = await axios.post('http://localhost:5007/api/auth/register/admin', {
        ...formData,
        role: 'Admin', // Set default role to Admin
      });

      if (response.status === 201) {
        const { user_id } = response.data; // Retrieve the admin ID from the response
        console.log(user_id);
        sessionStorage.setItem('adminId', user_id); // Store admin ID in session storage
        navigate('/crm/requirement-gathering'); // Navigate to the requirement gathering page
      }
    } catch (err) {
      setError('Error occurred during sign-up. Please try again.');
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
