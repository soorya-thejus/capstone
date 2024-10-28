import mongoose from "mongoose";
import { Contact ,IContact} from "../models/Contacts";
import axios from "axios";


export const createContactService = async (contactData: IContact) : Promise<IContact> => {
    const newContact = new Contact(contactData);
    return await newContact.save();
};

export const getAllContactsService = async (): Promise<IContact[]> => {
    return await Contact.find();
};

export const getContactByIdService = async (id: string): Promise<IContact|null> => {
    return await Contact.findById(id);
};

export const updateContactService = async (id: string, contactData: Partial<IContact>): Promise<IContact|null> => {
    const updatedContact = await Contact.findByIdAndUpdate(id, contactData, { new: true, runValidators: true });
    if (updatedContact?.deal_ids && updatedContact.deal_ids.length > 0) {
        // Make a request to Deals_Microservice to fetch deal values
        const response = await axios.post(`http://localhost:5002/api/deals/values`, {
          deal_ids: updatedContact.deal_ids,
        });
  
        if (response.data && response.data.deals) {
          // Sum the deal values and ensure conversion from Decimal128 to Number
          const totalDealValue = response.data.deals.reduce(
            (sum: number, deal: { deal_value: string }) => sum + parseFloat(deal.deal_value),
            0
          );
          updatedContact.deal_value = totalDealValue;
        }
      }
    return updatedContact;
};

export const deleteContactService = async (id: string): Promise<IContact|null> => {
    return await Contact.findByIdAndDelete(id);
};

export const getContactsByDealIdService = async (dealId: string): Promise<IContact[]> => {
    try {
        // Query the Contact model to find contacts that have the specified deal ID in their deal_ids array
        const contacts = await Contact.find({ deal_ids: dealId });

        // Return the found contacts
        return contacts;
    } catch (error) {
        console.error('Error fetching contacts for deal:', error);
        throw new Error('Unable to fetch contacts for this deal');
    }
};






// export const updateContactDealValueService = async (id: string, dealValue: number): Promise<IContact | null> => {
//     // Validate ID format
//     if (!mongoose.isValidObjectId(id)) {
//         throw new Error("Invalid contact ID");
//     }

//     // Update the contact’s deal value
//     const updatedContact = await Contact.findByIdAndUpdate(id, { deal_value: dealValue }, { new: true });
//     return updatedContact; // Returns the updated contact or null if not found
// };

