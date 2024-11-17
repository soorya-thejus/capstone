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
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [role, setRole] = useState('Sales Rep');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrgId = sessionStorage.getItem('orgId');
    if (storedOrgId) {
      setOrgId(storedOrgId);
    }
  }, []);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < minLength) {
      setPasswordError('Password must be at least 8 characters long.');
    } else if (!hasUpperCase) {
      setPasswordError('Password must contain at least one uppercase letter.');
    } else if (!hasNumber) {
      setPasswordError('Password must contain at least one number.');
    } else {
      setPasswordError(null); 
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    
    if (!username || !email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (passwordError) {
      setMessage('Please correct the password errors before submitting.');
      return;
    }

    
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
<h2>Signup Team Member</h2>
<div className={styles.form}>
  <form onSubmit={handleSignup}>
    {/* Input fields */}
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
      <input id="t-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </label>
    <label>
<<<<<<< HEAD
      Password:
      <input id="t-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </label>
=======
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => {
          setPassword(e.target.value);
          validatePassword(e.target.value); // Validate password on input change
          }}
          required
       />
      </label>
      {passwordError && <p className={styles.error}>{passwordError}</p>}
>>>>>>> dddd981848e63b54667a0d68ffc920a56b109f20
    <label>
      Role:
      <select id="t-select"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      >
        {/* <option value="Admin">Admin</option> */}
        <option value="Project Manager">Project Manager</option>
        <option value="Sales Rep">Sales Rep</option>
      </select>
    </label>
    <div className={styles.formButtons}>
      <button type="button" onClick={handleBack} className={styles.backButton}>Go Back to Dashboard</button>
      <button type="submit" className={styles.signupButton}>Sign Up Team Member</button>
    </div>
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
