// pages/SignUp.tsx
import React from 'react';
import Topbar from '../../components/crm/Topbar';
import styles from '../../styles/crm/auth.module.css';
import {Link} from 'react-router-dom';

const SignUp: React.FC = () => {
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
          <form>
            <label>Name</label>
            <input type="text" required />
            <label>Email</label>
            <input type="email" required />
            <label>Password</label>
            <input type="password" required />
            <button type="submit">Sign Up</button>
          </form>
          <p>Already have an account? <Link to="/crm/signin">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
