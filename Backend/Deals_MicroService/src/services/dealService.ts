// services/dealService.ts
import mongoose from "mongoose";
import { Deal, IDeal } from "../models/Deals";
import axios from "axios";

// Create a Deal
export const createDealService = async (dealData: IDeal): Promise<IDeal> => {
    const newDeal = new Deal(dealData);
    return await newDeal.save();  // This will return a Promise<IDeal>
};

// Get all Deals
export const getDealsService = async (): Promise<IDeal[]> => {
    return await Deal.find();  // This will return a Promise<IDeal[]>
};

// Get a Deal By Id
export const getDealByIdService = async (id: string): Promise<IDeal | null> => {
    return await Deal.findById(id);  // This will return a Promise<IDeal | null>
};

// Update Deal
export const updateDealService = async (id: string, dealData: Partial<IDeal>): Promise<IDeal | null> => {
    // Validate the ID format
    if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid deal ID");
    }

    try {
        // Update the deal
        const updatedDeal = await Deal.findByIdAndUpdate(id, dealData, { new: true, runValidators: true });

        if (updatedDeal) {
            // Only call updateContactDealValues if deal_value is present
            if (updatedDeal.deal_value !== undefined) {
                await updateContactDealValues(updatedDeal.id, updatedDeal.deal_value);
            }
        }

        return updatedDeal; // Return the updated deal or null if not found
    } catch (error) {
        console.error('Error updating deal:', error);
        throw new Error('Failed to update deal');
    }
};


// Delete a Deal
export const deleteDealService = async (id: string): Promise<IDeal | null> => {
    return await Deal.findByIdAndDelete(id);  // This will return a Promise<IDeal | null>
};

// Get Deal Values for deal_ids
export const getDealValuesService = async (deal_ids: string[]): Promise<{ deals: IDeal[], totalDealValue: number }> => {
    const deals = await Deal.find({ _id: { $in: deal_ids } }).select('deal_value');
    const totalDealValue = deals.reduce((sum, deal) => sum + Number(deal.deal_value), 0);
    return { deals, totalDealValue };  // This will return a Promise<{ deals: IDeal[], totalDealValue: number }>
};


const CONTACT_MICROSERVICE_URL = 'http://localhost:5005/api/contacts'; // Adjust as needed

// Other service functions...

// Function to get contacts by deal ID
async function getContactsByDealId(dealId: string) {
    try {
        const response = await axios.get(`${CONTACT_MICROSERVICE_URL}/deals/${dealId}`);
        return response.data; // Assuming it returns the contacts related to the deal
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw new Error('Unable to fetch contacts');
    }
}

// Example function to update contact deal values
async function updateContactDealValues(dealId: mongoose.Types.ObjectId, newDealValue: number) {
    // Fetch contacts associated with this deal from the contact microservice
    const contacts = await getContactsByDealId(dealId.toString());

    // Loop through each contact and update the deal_value by making an HTTP request to the contact microservice
    for (const contact of contacts) {
        // Calculate the total deal value for this contact’s deals
        const totalDealValue = await calculateTotalDealValue(contact.deal_ids);

        // Send an update request to the contact microservice
        try {
            await axios.put(`${CONTACT_MICROSERVICE_URL}/${contact._id}`, { deal_value: totalDealValue });
        } catch (error) {
            console.error(`Error updating deal value for contact ${contact._id}:`, error);
            throw new Error('Unable to update contact deal value');
        }
    }
}


async function calculateTotalDealValue(dealIds: mongoose.Types.ObjectId[]): Promise<number> {
    // Fetch all deals corresponding to the dealIds
    const deals = await Deal.find({ _id: { $in: dealIds } });

    // Calculate the total deal value
    const totalDealValue = deals.reduce((total, deal) => {
        return total + (deal.deal_value || 0); // Add deal_value or 0 if undefined
    }, 0);

    return totalDealValue; // Return the total value
}


