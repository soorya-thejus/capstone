import mongoose, { Types } from "mongoose";
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

export const updateContactService = async (id: string, contactData: Partial<IContact>): Promise<IContact | null> => {
    // Fetch the existing contact to compare `deal_ids`
    const existingContact = await Contact.findById(id);
    if (!existingContact) {
      throw new Error('Contact not found');
    }
  
    // Detect if there is a change in `deal_ids`
    const updatedDealIds = contactData.deal_ids;
    const dealIdsChanged = updatedDealIds && !arraysEqual(existingContact.deal_ids, updatedDealIds);
  
    // Update the contact
    const updatedContact = await Contact.findByIdAndUpdate(id, contactData, {
      new: true,
      runValidators: true,
    });
  
    if (updatedContact && dealIdsChanged) {
      // If `deal_ids` have changed, recalculate `deal_value`
      const response = await axios.post('http://localhost:5002/api/deals/values', {
        deal_ids: updatedContact.deal_ids,
      });
  
      if (response.data && response.data.deals) {
        // Calculate the new total deal value
        const totalDealValue = response.data.deals.reduce(
          (sum: number, deal: { deal_value: string }) => sum + parseFloat(deal.deal_value),
          0
        );
  
        // Update the contact's `deal_value`
        updatedContact.deal_value = totalDealValue;
        await updatedContact.save(); // Save the updated `deal_value`
      }
    }
  
    return updatedContact;
};

// Helper function to compare two arrays of ObjectIds
function arraysEqual(arr1: Types.ObjectId[], arr2: Types.ObjectId[]): boolean {
    if (arr1.length !== arr2.length) return false;
    const arr1Ids = arr1.map(id => id.toString());
    const arr2Ids = arr2.map(id => id.toString());
    return arr1Ids.every(id => arr2Ids.includes(id));
}

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




export const removeDealIdServcie = async (contactId: string, dealId: string): Promise<void> => {
    // Validate that `contactId` and `dealId` are valid ObjectIds
    if (!Types.ObjectId.isValid(contactId) || !Types.ObjectId.isValid(dealId)) {
      throw new Error('Invalid contact or deal ID');
    }
  
    // Update the contact to remove the specified deal_id from deal_ids
    await Contact.findByIdAndUpdate(contactId, { $pull: { deal_ids: dealId } });
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

