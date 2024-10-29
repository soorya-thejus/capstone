import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/crm/topbar.module.css'; // Assuming you have a CSS file for Topbar

const Topbar: React.FC = () => {
  return (
    <div className={styles.topbar}>
      <h1>Sales ERP</h1>
      <nav className={styles.navLinks}>
        <Link to="/" className={styles.link}>Home</Link> {/* Added Home link */}
      </nav>
    </div>
  );
};

export default Topbar;
