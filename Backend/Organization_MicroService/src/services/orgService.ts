import axios from 'axios';
import { IOrganization, Organization } from '../models/organization';

// Create a new Organization
export const createOrganizationService = async (data: Partial<IOrganization>): Promise<IOrganization> => {
    //const { name, type, address, contact_info,adminId } =data;
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
export const updateOrganizationService = async (id: string, adminId: string): Promise<IOrganization | null> => {
    // Update only the `admin` field in the organization document
    return await Organization.findByIdAndUpdate(id, { admin: adminId }, { new: true });
};

// Delete an Organization by ID
export const deleteOrganizationService = async (id: string): Promise<IOrganization | null> => {
    return await Organization.findByIdAndDelete(id);
};





export const fetchSalesRepsByOrg = async (id: string) => {
    return axios.get(`http://localhost:5007/orgs/${id}/salesreps`);
};










//Get Leads By Organization ID
export const getLeadsByOrgIdService = async (orgId: string) =>{
    return axios.get(`http://localhost:5001/api/leads/orgs/${orgId}`);
}

//Get Deals By Organization ID
export const getDealsByOrgIdService = async (orgId: string) =>{
    return axios.get(`http://localhost:5002/api/deals/orgs/${orgId}`);
}

//Get Accounts By Organization ID
export const getAccountsByOrgIdService = async (orgId: string) =>{
    return axios.get(`http://localhost:5003/api/accounts/orgs/${orgId}`);
}


//Get Projects By Organization ID
export const getProjectsByOrgIdService = async (orgId: string) =>{
    return axios.get(`http://localhost:5004/api/projects/orgs/${orgId}`);
}


//Get Contacts By Organization ID
export const getContactsByOrgIdService = async (orgId: string) =>{
    return axios.get(`http://localhost:5005/api/contacts/orgs/${orgId}`);
}
