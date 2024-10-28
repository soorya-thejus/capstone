import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import styles from '../styles/dashboardlayout.module.css';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.navbarContainer}>
        <Navbar />
      </div>
      <div className={styles.layoutMain}>
        <div className={styles.sidebarContainer}>
          <Sidebar />
        </div>
        <div className={styles.contentArea}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
