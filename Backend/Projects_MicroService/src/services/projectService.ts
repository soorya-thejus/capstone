import axios from "axios";
import { IProject, Project } from "../models/Project";

export const createProjectService = async (projectData: IProject): Promise<IProject> => {
  let rep_id = null;

  
  if (projectData.contact_id) {
    try {
     
      const response = await axios.get(`http://localhost:5005/api/contacts/${projectData.contact_id}`);
      
      
      const contact = response.data;
      rep_id = contact.owner_id;  
      
    } catch (error) {
      console.error(`Failed to fetch owner_id for contact ID ${projectData.contact_id}:`, error);
      throw new Error('Failed to fetch owner_id for the contact');
    }
  }

  
  const newProject = new Project({
      ...projectData,
      rep_id: rep_id  
  });

  
  const savedProject = await newProject.save();

  
  if (savedProject.contact_id) {
    try {
      await axios.patch(`http://localhost:5005/api/contacts/${savedProject.contact_id}/add-project`, {
        project_id: savedProject._id
      });
    } catch (error) {
      console.error(`Failed to update contact with project ID ${savedProject._id}:`, error);
      throw new Error('Failed to update contact with the new project ID');
    }
  }

  return savedProject;
  };

export const getAllProjectsService = async (): Promise<IProject[]> => {
    return await Project.find();
};

export const getProjectService = async (id: string): Promise<IProject|null> => {
    return await Project.findById(id);
};
 
export const updateProjectService = async (id: string, projectData: Partial<IProject>): Promise<IProject|null> => {
  let updatedProjectData = { ...projectData };

  if (projectData.contact_id) {
      try {
          const response = await axios.get(`http://localhost:5005/api/contacts/${projectData.contact_id}`);
          
          const contact = response.data;
          updatedProjectData.rep_id = contact.owner_id;
          
          await axios.patch(`http://localhost:5005/api/contacts/${projectData.contact_id}/add-project`, {
              project_id: id
          });
      } catch (error) {
          console.error(`Failed to update contact with project ID ${id}:`, error);
          throw new Error('Failed to update contact with the new project ID');
      }
  }

  const updatedProject = await Project.findByIdAndUpdate(id, updatedProjectData, {
      new: true,
      runValidators: true,
  });

  return updatedProject;};

export const deleteProjectService = async (id: string): Promise<IProject|null> => {
    const contacts = await getContactsByProjectId(id);

    for (const contact of contacts) {
        
        await axios.patch(`http://localhost:5005/api/contacts/${contact._id}/remove-project`, { project_id: id });
    }
    return await Project.findByIdAndDelete(id);
};




export const getProjectsByOrgIdService = async (org_id: string): Promise<IProject[] | null> => {
    return await Project.find({ org_id }); 
};



export const getProjectsByPm = async (org_id: string, owner_id: string): Promise<IProject[]|null> => {
 
  const projects = await Project.find({org_id,owner_id});
  return projects;
};

export const getProjectsBySalesRep = async (org_id: string, rep_id: string): Promise<IProject[]|null> => {
 
  const projects = await Project.find({org_id,rep_id});
  return projects;
};



 
const CONTACT_MICROSERVICE_URL = 'http://localhost:5005/api/contacts';

// Function to get contacts by account ID
async function getContactsByProjectId(projectId: string) {
    try {
        const response = await axios.get(`${CONTACT_MICROSERVICE_URL}/projects/${projectId}`);
        return response.data; // Assuming it returns the contacts related to the project
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw new Error('Unable to fetch contacts');
    }
}