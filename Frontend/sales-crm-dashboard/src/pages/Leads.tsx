// src/pages/Leads.tsx
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import styles from '../styles/leads.module.css';

const Leads: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.leadsContainer}>
        <h2>Manage Your Leads</h2>
        {/* Add functionality to manage leads here */}
      </div>
    </DashboardLayout>
  );
};

export default Leads;
