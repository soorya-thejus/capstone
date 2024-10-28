// src/pages/Deals.tsx
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import styles from '../styles/deals.module.css';

const Deals: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.dealsContainer}>
        <h2>Manage Your Deals</h2>
        {/* Add functionality to manage deals here */}
      </div>
    </DashboardLayout>
  );
};

export default Deals;
