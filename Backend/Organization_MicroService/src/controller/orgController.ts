import { Request, Response } from 'express';
import * as organizationService from '../services/orgService'; // Import your organization service here

// Create an Organization
export const createOrganization = async (req: Request, res: Response) => {
    try {
        const savedOrganization = await organizationService.createOrganizationService(req.body);
        res.status(201).json(savedOrganization);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error creating organization' });
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
        if (!organization)  res.status(404).json({ message: 'Organization not found' });
        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching organization' });
    }
};

// Update an Organization
export const updateOrganization = async (req: Request, res: Response) => {
    try {
        const updatedOrganization = await organizationService.updateOrganizationService(req.params.id, req.body);
        if (!updatedOrganization)  res.status(404).json({ message: 'Organization not found' });
        res.status(200).json(updatedOrganization);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error updating organization' });
    }
};

// Delete an Organization
export const deleteOrganization = async (req: Request, res: Response) => {
    try {
        const deletedOrganization = await organizationService.deleteOrganizationService(req.params.id);
        if (!deletedOrganization)  res.status(404).json({ message: 'Organization not found' });
        res.status(204).json({ message: 'Deleted successfully!' });
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error deleting organization' });
    }
};