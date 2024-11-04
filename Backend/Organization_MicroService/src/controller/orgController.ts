import { Request, Response } from 'express';
import * as organizationService from '../services/orgService'; // Import your organization service here
import { Organization } from '../models/organization';
 
// Create an Organization
export const createOrganization = async (req: Request, res: Response): Promise<void> => {
    try {
        const org = await organizationService.createOrganizationService(req.body);

        res.status(201).json({ message: 'Organization created successfully', org_id: org._id });
    } catch (error) {
        // Use a type assertion to treat `error` as an `Error` instance
        const err = error as Error;
        res.status(500).json({ message: 'Error creating organization', error: err.message });
    }
    
};

// Get All Organizations
export const getAllOrganizations = async (req: Request, res: Response) => {
    try {
        const organizations = await organizationService.getAllOrganizationsService();
        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching organizations' });
    }
};

// Get a Single Organization
export const getOrganization = async (req: Request, res: Response) => {
    try {
        const organization = await organizationService.getOrganizationService(req.params.id);
        if (!organization)  {res.status(404).json({ message: 'Organization not found' });
                return;};
        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching organization' });
    }
};

// Update an Organization
export const updateOrganization = async (req: Request, res: Response) => {
    const { adminId } = req.body;
    try {
        const updatedOrganization = await organizationService.updateOrganizationService(req.params.id, adminId);
        if (!updatedOrganization)  {res.status(404).json({ message: 'Organization not found' });
                    return;};
        res.status(200).json(updatedOrganization);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error updating organization' });
    }
};

// Delete an Organization
export const deleteOrganization = async (req: Request, res: Response) => {
    try {
        const deletedOrganization = await organizationService.deleteOrganizationService(req.params.id);
        if (!deletedOrganization) { res.status(404).json({ message: 'Organization not found' });
                    return;};
        res.status(204).json({ message: 'Deleted successfully!' });
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error deleting organization' });
    }
};





//Get Sales_Rep By Organization
export const getSalesRepsByOrg = async (req: Request, res: Response) => {
    try {
        const response = await organizationService.fetchSalesRepsByOrg(req.params.id);
        res.status(200).json(response.data); // Accessing response.data here directly
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error fetching sales reps' });
    }
};


















export const getLeadsByOrgId = async(req:Request, res:Response)=>{
    const orgId =req.params.orgId;

    try {
        const response = await organizationService.getLeadsByOrgIdService(orgId);
        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching leads', error: error.message });
    }
}


export const getDealsByOrgId = async(req:Request, res:Response)=>{
    const orgId =req.params.orgId;

    try {
        const response = await organizationService.getDealsByOrgIdService(orgId);
        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching deals', error: error.message });
    }
}


export const getAccountsByOrgId = async(req:Request, res:Response)=>{
    const orgId =req.params.orgId;

    try {
        const response = await organizationService.getAccountsByOrgIdService(orgId);
        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching accounts', error: error.message });
    }
}


export const getProjectsByOrgId = async(req:Request, res:Response)=>{
    const orgId =req.params.orgId;

    try {
        const response = await organizationService.getProjectsByOrgIdService(orgId);
        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
}


export const getContactsByOrgId = async(req:Request, res:Response)=>{
    const orgId =req.params.orgId;

    try {
        const response = await organizationService.getContactsByOrgIdService(orgId);
        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
}