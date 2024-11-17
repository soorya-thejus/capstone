import React, { useState, useEffect } from 'react';
import { Project } from '../../types/crm/Project';
import { Contact } from '../../types/crm/Contact';
import ProjectForm from './ProjectForm';
import * as projectService from '../../services/ProjectService';
import { ContactService } from '../../services/ContactService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

const ProjectsTable: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<{ [key: string]: string }>({});
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const orgId = sessionStorage.getItem('orgId') || '';
  const userId = sessionStorage.getItem('userId') || '';
  const role = sessionStorage.getItem('role') || '';

  useEffect(() => {
    const fetchProjectsAndContacts = async () => {
      try {
        let fetchedProjects: Project[] = [];
        if (role === 'Admin' || role === 'Project Manager') {
          fetchedProjects = await projectService.fetchProjectsByOrgId(orgId);
        } else if (role === 'Sales Rep') {
          fetchedProjects = await projectService.fetchProjectsBySalesRep(orgId, userId);
        }
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
  }, [orgId, userId, role]);

  const handleEditClick = (project: Project) => {
    if (role !== 'Sales Rep') {
      setSelectedProject({
        ...project,
        start_date: project.start_date ? new Date(project.start_date).toISOString().split("T")[0] : "",
        end_date: project.end_date ? new Date(project.end_date).toISOString().split("T")[0] : "",
      });
    }
  };

  const handleDeleteClick = async (id: string | undefined) => {
    if (role !== 'Sales Rep' && window.confirm("Are you sure you want to delete this project?") && id) {
      try {
        await projectService.deleteProject(id);
        setProjects(prev => prev.filter(project => project._id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleAddClick = () => {
    if (role !== 'Sales Rep') {
      setSelectedProject({
        _id: undefined,
        project_name: "",
        priority: "medium",
        start_date: "",
        end_date: "",
        status: "not started",
        contact_id: "",
        org_id: orgId,
        owner_id: userId
      });
    }
  };

  const handleSaveProject = async (project: Project) => {
    try {
      let savedProject: Project;
      if (project._id) {
        savedProject = await projectService.updateProject(project._id, project);
      } else {
        const { _id, ...newProject } = project;
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
    <div className="p-4 bg-white rounded-lg shadow">
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="No projects illustration"
            className="mb-4 w-32 h-32 object-cover"
          />
          <h2 className="text-lg font-semibold text-gray-700">No projects here</h2>
          <p className="text-sm text-gray-500">Get started by adding a new project.</p>
          {role === 'Project Manager' && (
            <button
              onClick={handleAddClick}
              className="mt-4 px-4 py-2 bg-black text-white rounded-md shadow flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Project</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {(role === 'Project Manager') && (
            <button
              onClick={handleAddClick}
              className="mb-4 px-4 py-2 bg-black text-white rounded-md shadow flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Project</span>
            </button>
          )}
          <table className="min-w-full border-collapse bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Priority</th>
                <th className="py-2 px-4 border-b">Contact Name</th>
                <th className="py-2 px-4 border-b">Start Date</th>
                <th className="py-2 px-4 border-b">End Date</th>
                <th className="py-2 px-4 border-b">Status</th>
                {(role === 'Admin' || role === 'Project Manager') && (
                  <>
                    <th className="py-2 px-4 border-b">Edit</th>
                    <th className="py-2 px-4 border-b">Delete</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{project.project_name}</td>
                  <td className="py-2 px-4 border-b">{project.priority}</td>
                  <td className="py-2 px-4 border-b">{contacts[project.contact_id || ""] || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{formatDate(project.start_date)}</td>
                  <td className="py-2 px-4 border-b">{formatDate(project.end_date)}</td>
                  <td className="py-2 px-4 border-b">{project.status}</td>
                  {(role === 'Admin' || role === 'Project Manager') && (
                    <>
                      <td className="py-2 px-4 border-b">
                        <button onClick={() => handleEditClick(project)}>
                          <FontAwesomeIcon icon={faPen} className="text-blue-500" />
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button onClick={() => handleDeleteClick(project._id)}>
                          <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {selectedProject && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
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
