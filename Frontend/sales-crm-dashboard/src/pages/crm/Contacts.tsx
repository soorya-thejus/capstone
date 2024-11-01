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
        <ContactsTable orgId={'67221a3f486241a8d7de5ab5'}  />
      </div>
    </DashboardLayout>
  );
};

export default Contacts;
