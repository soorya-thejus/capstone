// pages/SignIn.tsx
import React from 'react';
import Topbar from '../../components/crm/Topbar';
import styles from '../../styles/crm/auth.module.css';
import { Link } from 'react-router-dom';


const SignIn: React.FC = () => {
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
          <form>
            <label>Email</label>
            <input type="email" required />
            <label>Password</label>
            <input type="password" required />
            <button type="submit">Sign In</button>
          </form>
          <p>Don't have an account? <Link to="/crm/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
