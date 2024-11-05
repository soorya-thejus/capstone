// src/pages/Projects.tsx
import React from 'react';
import DashboardLayout from '../../layouts/crm/DashboardLayout';
import styles from '../../styles/crm/team.module.css';
import TeamTable from '../../components/crm/TeamTable';

const Projects: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.teamContainer}>
        <h2>Manage Your Team</h2>
        <TeamTable />
      </div>
    </DashboardLayout>
  );
};

export default Projects;
