import { IOrganization, Organization } from '../models/organization';

// Create a new Organization
export const createOrganizationService = async (data: Partial<IOrganization>): Promise<IOrganization> => {
    const organization = new Organization(data);
    return await organization.save();
};

// Get all Organizations
export const getAllOrganizationsService = async (): Promise<IOrganization[]> => {
    return await Organization.find();
};

// Get a single Organization by ID
export const getOrganizationService = async (id: string): Promise<IOrganization | null> => {
    return await Organization.findById(id);
};

// Update an Organization by ID
export const updateOrganizationService = async (id: string, data: Partial<IOrganization>): Promise<IOrganization | null> => {
    return await Organization.findByIdAndUpdate(id, data, { new: true });
};

// Delete an Organization by ID
export const deleteOrganizationService = async (id: string): Promise<IOrganization | null> => {
    return await Organization.findByIdAndDelete(id);
};
