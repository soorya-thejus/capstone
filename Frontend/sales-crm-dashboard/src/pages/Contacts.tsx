// src/pages/Contacts.tsx
import React from 'react';
import ContactsTable from '../components/ContactsTable';
import DashboardLayout from '../layouts/DashboardLayout';
import styles from '../styles/contacts.module.css';

const Contacts: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.contactsContainer}>
        <h2>Manage Your Contacts</h2>
        <ContactsTable />
      </div>
    </DashboardLayout>
  );
};

export default Contacts;
