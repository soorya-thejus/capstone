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
    return await Project.findByIdAndDelete(id);
};