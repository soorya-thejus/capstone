// src/pages/Dashboard.tsx
import React from 'react';
import DashboardLayout from '../../layouts/crm/DashboardLayout';
import Widget from '../../components/crm/Widget';
import styles from '../../styles/crm/dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.dashboardWidgets}>
        <Widget title="Forecasted Revenue" />
        <Widget title="Actual Revenue" />
        <Widget title="Sales Pipeline" />
        <Widget title="Deal Progress by Month" />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
