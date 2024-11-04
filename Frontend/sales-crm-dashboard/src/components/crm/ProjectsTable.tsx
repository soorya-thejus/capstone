import React, { useState, useEffect } from 'react';
import { Project } from '../../types/crm/Project';
import { Contact } from '../../types/crm/Contact';
import ProjectForm from './ProjectForm';
import * as projectService from '../../services/ProjectService';
import { ContactService } from '../../services/ContactService';
import styles from '../../styles/crm/projectstable.module.css';

interface ProjectsTableProps {
  orgId: string;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ orgId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<{ [key: string]: string }>({});
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjectsAndContacts = async () => {
      try {
        const fetchedProjects = await projectService.fetchProjectsByOrgId(orgId);
        setProjects(fetchedProjects);

        const fetchedContacts: Contact[] = await ContactService.getAllContactsByOrgId(orgId);
        const contactMap = fetchedContacts.reduce((acc: { [key: string]: string }, contact: Contact) => {
          if (contact._id) {
            acc[contact._id] = contact.contact_name;
          }
          return acc;
        }, {});
        setContacts(contactMap);
      } catch (error) {
        console.error("Error fetching projects or contacts:", error);
      }
    };

    fetchProjectsAndContacts();
  }, [orgId]);

  const handleEditClick = (project: Project) => {
    setSelectedProject({
      ...project,
      start_date: project.start_date ? new Date(project.start_date).toISOString().split("T")[0] : "",
      end_date: project.end_date ? new Date(project.end_date).toISOString().split("T")[0] : "",
    });
  };

  const handleDeleteClick = async (id: string | undefined) => {
    if (window.confirm("Are you sure you want to delete this project?") && id) {
      try {
        await projectService.deleteProject(id);
        setProjects(prev => prev.filter(project => project._id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleAddClick = () => {
    setSelectedProject({
      _id: undefined,  // Use _id here for MongoDB compatibility
      project_name: "",
      priority: "medium",
      start_date: "",
      end_date: "",
      status: "not started",
      contact_id: "",
      org_id: orgId,
    });
  };

  const handleSaveProject = async (project: Project) => {
    try {
      let savedProject: Project;
      if (project._id) {
        savedProject = await projectService.updateProject(project._id, project);
      } else {
        const { _id, ...newProject } = project;  // Exclude _id field for new project creation
        savedProject = await projectService.createProject(newProject);
      }

      setProjects(prev =>
        prev.some(p => p._id === savedProject._id)
          ? prev.map(p => (p._id === savedProject._id ? savedProject : p))
          : [...prev, savedProject]
      );
      setSelectedProject(null);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleCancel = () => {
    setSelectedProject(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.tableContainer}>
      <button onClick={handleAddClick} className={styles.addButton}>Add Project</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Priority</th>
            <th>Contact Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map(project => (
              <tr key={project._id}>
                <td>{project.project_name}</td>
                <td>{project.priority}</td>
                <td>{contacts[project.contact_id || ""] || "N/A"}</td>
                <td>{formatDate(project.start_date)}</td>
                <td>{formatDate(project.end_date)}</td>
                <td>{project.status}</td>
                <td>
                  <button onClick={() => handleEditClick(project)}>Edit</button>
                </td>
                <td>
                  <button className={styles.deleteButton} onClick={() => handleDeleteClick(project._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No projects available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedProject !== null && (
        <div className={styles.formContainer}>
          <ProjectForm
            project={selectedProject}
            onSave={handleSaveProject}
            onCancel={handleCancel}
            orgId={orgId}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
