// src/pages/Projects.tsx
import React from 'react';
import DashboardLayout from '../../layouts/crm/DashboardLayout';
import styles from '../../styles/crm/projects.module.css';

const Projects: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.projectsContainer}>
        <h2>Manage Your Projects</h2>
        {/* Add functionality to manage projects here */}
      </div>
    </DashboardLayout>
  );
};

export default Projects;
