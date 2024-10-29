import axios from "axios";
import { IProject, Project } from "../models/Project";

export const createProjectService = async (contactData: IProject) : Promise<IProject> => {
    const newContact = new Project(contactData);
    return await newContact.save();
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