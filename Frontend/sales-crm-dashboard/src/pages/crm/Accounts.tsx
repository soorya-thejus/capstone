// src/pages/Contacts.tsx
import React from 'react';
import AccountsTable from '../../components/crm/AccountsTable';
import DashboardLayout from '../../layouts/crm/DashboardLayout';
import styles from '../../styles/crm/accounts.module.css';

const Accounts: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.accountsContainer}>
        <h2>Manage Your Accounts</h2>
        <AccountsTable/>
      </div>
    </DashboardLayout>
  );
};

export default Accounts;
