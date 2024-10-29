// src/pages/Contacts.tsx
import React from 'react';
import ContactsTable from '../../components/crm/ContactsTable';
import DashboardLayout from '../../layouts/crm/DashboardLayout';
import styles from '../../styles/crm/contacts.module.css';

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
