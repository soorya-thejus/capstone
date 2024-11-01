import React, { useState, useEffect } from 'react';
import { Project } from '../../types/crm/Project';
import ProjectForm from './ProjectForm';
import * as projectService from '../../services/ProjectService';
import styles from '../../styles/crm/projectstable.module.css';

interface ProjectsTableProps {
  orgId: string; // Pass organization ID as a prop
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ orgId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await projectService.fetchProjectsByOrgId(orgId);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [orgId]);

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleDeleteClick = async (id: string | undefined) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      if (id) {
        try {
          await projectService.deleteProject(id);
          setProjects(prev => prev.filter(project => project.id !== id));
        } catch (error) {
          console.error("Error deleting project:", error);
        }
      }
    }
  };

  const handleAddClick = () => {
    setSelectedProject({
      id: undefined, // Set to undefined for new project
      project_name: "",
      priority: "medium",
      start_date: "",
      end_date: "",
      status: "not started",
      contact_id: "", // Adjust based on your contact management
      org_id: orgId, // Use the organization ID for the new project
    });
  };

  const handleSaveProject = async (project: Project) => {
    try {
      let savedProject: Project;
      if (project.id) {
        savedProject = await projectService.updateProject(project.id, project);
      } else {
        console.log("Creating new project:", project);
        savedProject = await projectService.createProject(project);
      }
  
      setProjects(prev =>
        prev.some(p => p.id === savedProject.id)
          ? prev.map(p => (p.id === savedProject.id ? savedProject : p))
          : [...prev, savedProject]
      );
      setSelectedProject(null); // Close form after saving
    } catch (error) {
      console.error("Error saving project:", error);
    }
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
              <td>{project.project_name}</td>
              <td>{project.priority}</td>
              <td>{project.start_date}</td>
              <td>{project.end_date}</td>
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
      orgId={orgId} // Pass orgId here
    />
  </div>
)}
    </div>
  );
};

export default ProjectsTable;
