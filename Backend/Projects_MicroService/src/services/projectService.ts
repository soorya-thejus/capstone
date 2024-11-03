import axios from "axios";
import { IProject, Project } from "../models/Project";

export const createProjectService = async (projectData: IProject): Promise<IProject> => {
    const newProject = new Project(projectData);
    const savedProject = await newProject.save();
  
    // Update the contact's project_ids in the Contacts microservice
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
 
export const updateProjectService = async (id: string, contactData: Partial<IProject>): Promise<IProject|null> => {
    return await Project.findByIdAndUpdate(id, contactData, { new: true, runValidators: true });
};

export const deleteProjectService = async (id: string): Promise<IProject|null> => {
    const contacts = await getContactsByProjectId(id);

    for (const contact of contacts) {
        // Make an HTTP request to update the contact in the Contacts Microservice
        await axios.patch(`http://localhost:5005/api/contacts/${contact._id}/remove-project`, { project_id: id });
    }
    return await Project.findByIdAndDelete(id);
};



//Get Projects by Org Id
export const getProjectsByOrgIdService = async (org_id: string): Promise<IProject[] | null> => {
    return await Project.find({ org_id }); // Query using org_id, not id
};


//Get Projects by Sales Rep in an Org
export const getProjectsBySalesRep = async (org_id: string, owner_id: string): Promise<IProject[]|null> => {
  // Query for projects matching both the organization and sales rep (owner) criteria
  const projects = await Project.find({org_id,owner_id});
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