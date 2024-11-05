// src/pages/crm/TeamMemberSignup.tsx
import React, { useState, useEffect } from 'react';
import { registerTeamMember } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/crm/teammembersignup.module.css';

const TeamMemberSignup: React.FC = () => {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Sales Rep');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrgId = sessionStorage.getItem('orgId');
    if (storedOrgId) {
      setOrgId(storedOrgId);
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!username || !email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    // Ensure orgId is a string and not null
    if (!orgId) {
      setMessage("Organization ID is required.");
      return;
    }

    try {
      await registerTeamMember({ org_id: orgId as string, username, email, password, role });
      setMessage(`${role} successfully signed up!`);
      setIsSubmitted(true); // Set submitted state to true
    } catch (error) {
      setMessage('Error signing up Team Member.');
    }
  };

  const handleBack = () => {
    navigate('/crm/dashboard');
  };

  return (
    <div className={styles.signupContainer}>
      {!isSubmitted ? (
        <>
          <div className={styles.header}>
            <h2>Sign Up Team Member</h2>
          </div>
          <div className={styles.form}>
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
              <label>
                Role:
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="Admin">Admin</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Sales Rep">Sales Rep</option>
                </select>
              </label>
              <button type="button" onClick={handleBack} className={styles.backButton}>Go Back to Dashboard</button>
              <button type="submit" className={styles.signupButton}>Sign Up Team Member</button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
          </div>
        </>
      ) : (
        <div className={styles.successMessage}>
          <p className={styles.message}>{message}</p>
          <button onClick={handleBack} className={styles.backButton}>Go Back to Dashboard</button>
        </div>
      )}
    </div>
  );
};

export default TeamMemberSignup;
