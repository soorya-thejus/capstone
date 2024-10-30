import { Request, Response } from 'express';
import { Lead } from '../models/Leads';
import * as leadService from '../services/leadService';

// Create a new lead
export const createLead = async (req: Request, res: Response) => {
    try {
        const savedLead = await leadService.createLeadService(req.body);
        res.status(201).json(savedLead);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error creating lead' });
    }
};

// Get all leads
export const getLeads = async (req: Request, res: Response) => {
    try {
        const leads = await leadService.getLeadsService(); // Populate Sales Rep details (assuming `username` exists)
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching leads' });
    }
};

// Get a lead by ID
export const getLeadById = async (req: Request, res: Response) =>  {
    try {   
        const lead = await leadService.getLeadByIdService(req.params.id);
        if (!lead) {res.status(404).json({ message: 'Lead not found' });
            return;};
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching lead' });
    }
};

// Update a lead
export const updateLead = async (req: Request, res: Response) => {
    try {
        const updatedLead = await leadService.updateLeadService(req.params.id, req.body);
        if (!updatedLead)  {res.status(404).json({ message: 'Lead not found' });
            return;};
        res.status(200).json(updatedLead);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error updating lead' });
    }
};

// Delete a lead
export const deleteLead = async (req: Request, res: Response) => {
    try {
        const deletedLead = await leadService.deleteLeadService(req.params.id);
        if (!deletedLead)  {res.status(404).json({ message: 'Lead not found' });
            return;};
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error deleting lead' });
    }
};


export const getLeadsByOrgId = async (req: Request, res: Response) => {
    const { org_id } = req.params;
    try {
        const leads = await leadService.getLeadsByOrgIdService(org_id);
        res.status(200).json(leads);
    } catch (error) {
        console.error("Error fetching leads for org_id:", error);
        res.status(500).json({ message: 'Error fetching leads for this organization' });
    }
};




// export const updateStatus = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const { status } = req.body;
  
//     try {
//       const updatedLead = await leadService.statusUpdateService(id, status);
//       res.status(200).json({ message: 'Lead status updated successfully', lead: updatedLead });
//     } catch (error) {
//       res.status(500).json({ message: error instanceof Error ? error.message : 'Error updating lead status' });
//     }
//   };