// src/pages/Deals.tsx
import React from 'react';
import DealsTable from '../../components/crm/DealsTable';
import DashboardLayout from '../../layouts/crm/DashboardLayout';
import styles from '../../styles/crm/deals.module.css';

const Deals: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.dealsContainer}>
        <h2>Manage Your Deals</h2>
        <DealsTable orgId={'67221a3f486241a8d7de5ab5'} ownerId='' />
      </div>
    </DashboardLayout>
  );
};

export default Deals;
