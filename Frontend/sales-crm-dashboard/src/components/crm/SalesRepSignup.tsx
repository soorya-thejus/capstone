import React, { useState, useEffect } from 'react';
import { registerSalesRep } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import styles from '../../styles/crm/salesrepsignup.module.css';

const SalesRepSignup: React.FC = () => {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false); // New state to manage success
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const storedOrgId = sessionStorage.getItem('orgId');
    if (storedOrgId) {
      setOrgId(storedOrgId);
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) {
      setMessage("Organization ID is required.");
      return;
    }

    try {
      await registerSalesRep({ org_id: orgId, username, email, password });
      setSuccess(true); // Set success state to true
      setMessage('Sales Rep successfully signed up!');
    } catch (error) {
      setMessage('Error signing up Sales Rep.');
    }
  };

  const handleBack = () => {
    navigate('/crm/dashboard'); // Navigate back to the user dashboard
  };

  return (
    <div className={styles.signupContainer}>
      <button onClick={handleBack} className={styles.backButton}>
        Go Back to Dashboard
      </button>
      {success ? (
        <div className={styles.successMessage}>
          <h2>{message}</h2>
        </div>
      ) : (
        <div className={styles.form}>
          <h2>Sign Up Sales Rep</h2>
          <form onSubmit={handleSignup}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit">Sign Up Sales Rep</button>
          </form>
          {message && <p className={styles.message}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default SalesRepSignup;
