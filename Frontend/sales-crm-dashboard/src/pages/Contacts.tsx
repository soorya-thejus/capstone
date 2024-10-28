// src/pages/Contacts.tsx
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import styles from '../styles/contacts.module.css';

const Contacts: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.contactsContainer}>
        <h2>Manage Your Contacts</h2>
        {/* Add functionality to manage contacts here */}
      </div>
    </DashboardLayout>
  );
};

export default Contacts;
