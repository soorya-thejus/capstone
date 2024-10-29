// src/components/ProjectsTable.tsx
import React, { useState } from 'react';
import { Project } from '../../types/crm/Project';
import ProjectForm from './ProjectForm';
import styles from '../../styles/crm/projectstable.module.css';

const initialProjects: Project[] = [
  { id: 1, name: "Project Alpha", priority: "High", startDate: "2024-01-01", endDate: "2024-06-01", status: "In Progress" },
  { id: 2, name: "Project Beta", priority: "Medium", startDate: "2023-02-01", endDate: "2024-05-01", status: "Not Started" },
];

const ProjectsTable: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter(project => project.id !== id));
    }
  };

  const handleAddClick = () => {
    setSelectedProject({
      id: Date.now(),
      name: "",
      priority: "Medium",
      startDate: "",
      endDate: "",
      status: "Not Started",
    });
  };

  const handleSaveProject = (project: Project) => {
    setProjects(prev =>
      prev.some(p => p.id === project.id)
        ? prev.map(p => (p.id === project.id ? project : p))
        : [...prev, project]
    );
    setSelectedProject(null); // Close form after saving
  };

  const handleCancel = () => {
    setSelectedProject(null);
  };

  return (
    <div className={styles.tableContainer}>
      <button onClick={handleAddClick} className={styles.addButton}>Add Project</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Priority</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.priority}</td>
              <td>{project.startDate}</td>
              <td>{project.endDate}</td>
              <td>{project.status}</td>
              <td>
                <button onClick={() => handleEditClick(project)}>Edit</button>
              </td>
              <td>
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(project.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render ProjectForm directly below the table if a project is being edited or added */}
      {(selectedProject !== null) && (
        <div className={styles.formContainer}>
          <ProjectForm
            project={selectedProject}
            onSave={handleSaveProject}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
