// src/pages/Projects.tsx
import React from 'react';
import ProjectsTable from '../../components/crm/ProjectsTable';
import DashboardLayout from '../../layouts/crm/DashboardLayout';
import styles from '../../styles/crm/projects.module.css';

const Projects: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.projectsContainer}>
        <h2>Manage Your Projects</h2>
        <ProjectsTable orgId={'67221a3f486241a8d7de5ab5'}/>
      </div>
    </DashboardLayout>
  );
};

export default Projects;
