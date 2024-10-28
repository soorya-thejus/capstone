import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/topbar.module.css'; // Assuming you have a CSS file for Topbar

const Topbar: React.FC = () => {
  return (
    <div className={styles.topbar}>
      <h1>CRM Dashboard</h1>
      <nav className={styles.navLinks}>
        <Link to="/" className={styles.link}>Home</Link> {/* Added Home link */}
        <Link to="/signup" className={styles.link}>Get Started</Link>
        <Link to="/signin" className={styles.link}>Sign In</Link>
      </nav>
    </div>
  );
};

export default Topbar;
