// src/pages/Contacts.tsx
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import styles from '../styles/accounts.module.css';

const Accounts: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.accountsContainer}>
        <h2>Manage Your Accounts</h2>
        {/* Add functionality to manage contacts here */}
      </div>
    </DashboardLayout>
  );
};

export default Accounts;
