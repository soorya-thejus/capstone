import React from 'react';
import {  useNavigate } from 'react-router-dom';
import styles from '../styles/home.module.css';
import Topbar from '../components/crm/Topbar';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleRetailClick = () => {
    // Route to the retail service
    navigate('/retail');
  };

  const handleSoftwareClick = () => {
    // Route to CRM signup page
    navigate('/crm/signup');
  };

  return (
    <div className={styles.homeContainer}>
      <Topbar />
      <main className={styles.mainContent}>
        <h2>Welcome to Sales ERP</h2>
        <p>Manage your sales, contacts, and projects from one powerful platform.</p>
        <div className={styles.buttons}>
          <button onClick={handleRetailClick} className={styles.button}>Retail</button>
          <button onClick={handleSoftwareClick} className={styles.button}>Software</button>
        </div>
      </main>
    </div>
  );
};

export default Home;
