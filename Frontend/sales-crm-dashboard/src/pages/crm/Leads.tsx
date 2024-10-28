// src/pages/Leads.tsx
import React from 'react';
import LeadsTable from '../../components/crm/LeadsTable';
import DashboardLayout from '../../layouts/crm/DashboardLayout';
import styles from '../../styles/crm/leads.module.css';

const Leads: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.leadsContainer}>
        <h2>Manage Your Leads</h2>
        <LeadsTable />
      </div>
    </DashboardLayout>
  );
};

export default Leads;
