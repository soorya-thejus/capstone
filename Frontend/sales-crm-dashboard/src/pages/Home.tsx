import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/home.module.css';
import Topbar from '../components/Topbar'; // Import the Topbar component

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <Topbar /> {/* Include the Topbar component */}
      <main className={styles.mainContent}>
        <h2>Welcome to CRM Dashboard</h2>
        <p>Manage your sales, contacts, and projects from one powerful platform.</p>
        <div className={styles.buttons}>
          <Link to="/signup" className={styles.button}>Get Started</Link>
          <Link to="/signin" className={styles.button}>Sign In</Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
