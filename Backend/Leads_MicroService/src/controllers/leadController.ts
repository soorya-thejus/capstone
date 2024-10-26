import { Request, Response } from 'express';
import Lead from '../models/Leads'; // Adjust the path as needed

// Create a new lead
export const createLead = async (req: Request, res: Response) => {
    try {
        const newLead = new Lead(req.body);
        const savedLead = await newLead.save();
        res.status(201).json(savedLead);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error creating lead' });
    }
};

// Get all leads
export const getLeads = async (req: Request, res: Response) => {
    try {
        const leads = await Lead.find(); // Populate Sales Rep details (assuming `username` exists)
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching leads' });
    }
};

// Get a lead by ID
export const getLeadById = async (req: Request, res: Response) =>  {
    try {   
        const lead = await Lead.findById(req.params.id);
        if (!lead) res.status(404).json({ message: 'Lead not found' });
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching lead' });
    }
};

// Update a lead
export const updateLead = async (req: Request, res: Response) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedLead)  res.status(404).json({ message: 'Lead not found' });
        res.status(200).json(updatedLead);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error updating lead' });
    }
};

// Delete a lead
export const deleteLead = async (req: Request, res: Response) => {
    try {
        const deletedLead = await Lead.findByIdAndDelete(req.params.id);
        if (!deletedLead)  res.status(404).json({ message: 'Lead not found' });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error deleting lead' });
    }
};
