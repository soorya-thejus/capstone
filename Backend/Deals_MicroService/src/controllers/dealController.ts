// controllers/dealController.ts
import { Request, Response } from 'express';
import * as dealService from '../services/dealService';

// Create a Deal
export const createDeal = async (req: Request, res: Response) => {
    try {
        // Call the service to create a deal with the request body
        const savedDeal = await dealService.createDealService(req.body);
         res.status(201).json(savedDeal); // Respond with the created deal
    } catch (error) {
        // Handle error if the deal creation fails
         res.status(400).json({ message: error instanceof Error ? error.message : 'Error creating Deal' });
    }
};

// Get all Deals
export const getDeals = async (req: Request, res: Response) => {
    try {
        // Call the service to get all deals
        const deals = await dealService.getDealsService();
         res.status(200).json(deals); // Respond with the list of deals
    } catch (error) {
        // Handle error if fetching deals fails
         res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching deals' });
    }
};

// Get a Deal By Id
export const getDealById = async (req: Request, res: Response) => {
    try {
        // Call the service to get a deal by its ID
        const deal = await dealService.getDealByIdService(req.params.id);
        if (!deal)  res.status(404).json({ message: 'Deal not found' }); // Handle case where deal is not found
         res.status(200).json(deal); // Respond with the found deal
    } catch (error) {
        // Handle error if fetching the deal fails
         res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching deal' });
    }
};

// Update Deal
export const updateDeal = async (req: Request, res: Response) => {
    try {
        // Call the service to update a deal
        const updatedDeal = await dealService.updateDealService(req.params.id, req.body);
        if (!updatedDeal)  res.status(404).json({ message: 'Deal not found' }); // Handle case where deal is not found
         res.status(200).json(updatedDeal); // Respond with the updated deal
    } catch (error) {
        // Handle error if updating the deal fails
         res.status(400).json({ message: error instanceof Error ? error.message : 'Error updating deal' });
    }
};

// Delete a Deal
export const deleteDeal = async (req: Request, res: Response) => {
    try {
        // Call the service to delete a deal
        const deletedDeal = await dealService.deleteDealService(req.params.id);
        if (!deletedDeal)  res.status(404).json({ message: 'Deal not found' }); // Handle case where deal is not found
         res.status(204).json({ message: 'Deleted successfully!' }); // Respond with success message
    } catch (error) {
        // Handle error if deleting the deal fails
         res.status(400).json({ message: error instanceof Error ? error.message : 'Error deleting deal' });
    }
};

// Get Deal Values for deal_ids
export const getDealValues = async (req: Request, res: Response) => {
    try {
        const { deal_ids } = req.body;

        // Validate input
        if (!Array.isArray(deal_ids)) {
             res.status(400).json({ error: 'deal_ids must be an array.' });
        }

        // Call the service to get deal values
        const { deals, totalDealValue, totalForecastValue} = await dealService.getDealValuesService(deal_ids);
         res.json({ deals, totalDealValue, totalForecastValue}); // Respond with the deals and total value
    } catch (error) {
        console.error('Error fetching deal values:', error);
         res.status(500).json({ error: 'Internal Server Error' });
    }
}; 



//Get Deals by Org Id
export const getDealsByOrgId = async (req: Request, res: Response) => {
    const { org_id } = req.params;
    try {
        const deals = await dealService.getDealsByOrgIdService(org_id);
        res.status(200).json(deals);
    } catch (error) {
        console.error("Error fetching deals for org_id:", error);
        res.status(500).json({ message: 'Error fetching deals for this organization' });
    }
};