// services/leadService.ts
import { Lead, ILead } from "../models/Leads"; // Assuming you have a model file for leads

// Create a Lead
export const createLeadService = async (leadData: ILead): Promise<ILead> => {
    const newLead = new Lead(leadData);
    return await newLead.save(); // This will return a Promise<ILead>
};

// Get all Leads
export const getLeadsService = async (): Promise<ILead[]> => {
    return await Lead.find(); // This will return a Promise<ILead[]>
};

// Get a Lead By Id
export const getLeadByIdService = async (id: string): Promise<ILead | null> => {
    return await Lead.findById(id); // This will return a Promise<ILead | null>
};

// Update Lead
export const updateLeadService = async (id: string, leadData: Partial<ILead>): Promise<ILead | null> => {
    return await Lead.findByIdAndUpdate(id, leadData, { new: true, runValidators: true }); // This will return a Promise<ILead | null>
};

// Delete a Lead
export const deleteLeadService = async (id: string): Promise<ILead | null> => {
    return await Lead.findByIdAndDelete(id); // This will return a Promise<ILead | null>
};

