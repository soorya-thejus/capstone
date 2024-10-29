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
            // Only call updateContactDealValues if deal_value & froecast_value is present
            if (updatedDeal.deal_value !== undefined && updatedDeal.forecast_value !== undefined) {
                await updateContactDealValues(updatedDeal.id, updatedDeal.deal_value, updatedDeal.forecast_value);
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
    // Fetch contacts associated with the specified deal_id
    const contacts = await getContactsByDealId(id);
  
    // Remove the deal_id from the deal_ids field for each contact in the Contacts Microservice
    for (const contact of contacts) {
      // Make an HTTP request to update the contact in the Contacts Microservice
      await axios.patch(`http://localhost:5005/api/contacts/${contact._id}/remove-deal`, { deal_id: id });
  
      // Recalculate the deal_value for the updated contact
      const remainingDealIds = contact.deal_ids.filter((dealId: { toString: () => string; }) => dealId.toString() !== id);
      if (remainingDealIds.length > 0) {
        // Fetch the deal values for the remaining deals from the Deals Microservice
        const response = await axios.post('http://localhost:5002/api/deals/values', {
          deal_ids: remainingDealIds,
        });
  
        if (response.data && response.data.deals) {
          // Calculate the new total deal value
          const totalDealValue = response.data.deals.reduce(
            (sum: number, deal: { deal_value: string }) => sum + parseFloat(deal.deal_value),
            0
          );

          const totalForecastValue = response.data.deals.reduce(
            (sum: number, deal: { forecast_value: string }) => sum + parseFloat(deal.forecast_value),
            0
          );
          // Update the deal_value in the Contacts Microservice
          await axios.put(`http://localhost:5005/api/contacts/${contact._id}`, { deal_value: totalDealValue, forecast_value: totalForecastValue });
        }
      } else {
        // If no remaining deals, set deal_value to 0
        await axios.put(`http://localhost:5005/api/contacts/${contact._id}`, { deal_value: 0, forecast_value: 0 });
      }
    }
  
    // Delete the deal
    return await Deal.findByIdAndDelete(id);
  };

// Get Deal Values for deal_ids
export const getDealValuesService = async (deal_ids: string[]): Promise<{ deals: IDeal[], totalDealValue: number, totalForecastValue: number  }> => {
    const deals = await Deal.find({ _id: { $in: deal_ids } }).select('deal_value forecast_value'); // Fetch both values
    const totalDealValue = deals.reduce((sum, deal) => sum + Number(deal.deal_value), 0);
    const totalForecastValue = deals.reduce((sum, deal) => sum + Number(deal.forecast_value), 0); // Sum of forecast values
    return { deals, totalDealValue, totalForecastValue };
};


//Get Deals by Org Id
export const getDealsByOrgIdService = async (org_id: string): Promise<IDeal[] | null> => {
    return await Deal.find({ org_id }); // Query using org_id, not id
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

// Example function to update contact deal values & forecast values
async function updateContactDealValues(dealId: mongoose.Types.ObjectId, newDealValue: number, newForecastValue: number) {
    // Fetch contacts associated with this deal from the contact microservice
    const contacts = await getContactsByDealId(dealId.toString());

    // Loop through each contact and update the deal_value & forecast_value by making an HTTP request to the contact microservice
    for (const contact of contacts) {
        // Calculate the total deal value for this contact’s deals
        const totalDealValue = await calculateTotalDealValue(contact.deal_ids);

        // Calculate the total forecast value for this contact’s deals
        const totalForecastValue = await calculateTotalForecastValue(contact.deal_ids);

        // Send an update request to the contact microservice
        try {
            await axios.put(`${CONTACT_MICROSERVICE_URL}/${contact._id}`, { deal_value: totalDealValue , forecast_value: totalForecastValue});
        } catch (error) {
            console.error(`Error updating deal value & forecast value for contact ${contact._id}:`, error);
            throw new Error('Unable to update contact deal value & forecast value');
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

async function calculateTotalForecastValue(dealIds: mongoose.Types.ObjectId[]): Promise<number> {
    // Fetch all deals corresponding to the dealIds
    const deals = await Deal.find({ _id: { $in: dealIds } });

    // Calculate the total deal value
    const totalForecastValue = deals.reduce((total, deal) => {
        return total + (deal.forecast_value || 0); // Add deal_value or 0 if undefined
    }, 0);

    return totalForecastValue; // Return the total value
}


