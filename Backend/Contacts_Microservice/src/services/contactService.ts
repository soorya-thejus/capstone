import mongoose, { Types } from "mongoose";
import { Contact ,IContact} from "../models/Contacts";
import axios from "axios";


export const createContactService = async (contactData: Partial<IContact>): Promise<IContact> => {
  const { lead_id, contact_name, title, email, phone , org_id} = contactData;

  if (!lead_id || !contact_name || !title || !email || !phone || !org_id) {
      throw new Error('Missing required contact information');
  }

  // Check if a contact with the given `lead_id` already exists
  const existingContact = await Contact.findOne({ lead_id });
  if (existingContact) {
      throw new Error('Contact with this lead ID already exists');
  }

  // Create the new contact
  const newContact = new Contact({
      lead_id,
      contact_name,
      title,
      email,
      phone,
      org_id,
  });

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
 
    // If an account_id is provided in contactData, check if it exists
    // if (contactData.account_id) {
    //     const isAccountValid = await accountExists(contactData.account_id.toString());
    //     if (!isAccountValid) {
    //         throw new Error(`Account ID ${contactData.account_id} does not exist`);
    //     }
    // }
  
    // Detect if there is a change in `deal_ids`
    const updatedDealIds = contactData.deal_ids;
    const dealIdsChanged = updatedDealIds && !arraysEqual(existingContact.deal_ids, updatedDealIds);
  
    // Update the contact
    const updatedContact = await Contact.findByIdAndUpdate(id, contactData, {
      new: true,
      runValidators: true,
    });
  
    if (updatedContact && dealIdsChanged) {
      // If `deal_ids` have changed, recalculate `deal_value & forecast_value`
      const response = await axios.post('http://localhost:5002/api/deals/values', {
        deal_ids: updatedContact.deal_ids,
      });
  
      if (response.data && response.data.deals) {
        // Calculate the new total deal value
        const totalDealValue = response.data.deals.reduce(
          (sum: number, deal: { deal_value: string }) => sum + parseFloat(deal.deal_value),
          0
        );

        // Calculate the new total forecast value
        const totalForecastValue = response.data.deals.reduce(
          (sum: number, deal: { forecast_value: string }) => sum + parseFloat(deal.forecast_value),
          0
      );
  
        // Update the contact's `deal_value & froecast_value`
        updatedContact.deal_value = totalDealValue;
        updatedContact.forecast_value = totalForecastValue
        await updatedContact.save(); // Save the updated `deal_value & forecast_value`
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



  // export const getContactsByAccountIdService = async (accountId: string): Promise<IContact[]|[]> => {
  //   try {
  //     const contacts = await Contact.find({ account_id: accountId }); 
  //     return contacts || [];  // Return an empty array if no contacts are found
  // } catch (error) {
  //     console.error('Error fetching contacts for account:', error);
  //     throw new Error('Unable to fetch contacts for this account');
  // }
  // };
  

  export const removeAccountIdService = async (contactId: string): Promise<void> => {
    // Validate that `contactId` is a valid ObjectId
    if (!Types.ObjectId.isValid(contactId)) {
        throw new Error('Invalid contact ID');
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        contactId,
        { $set: { account_id: null } }, // Set account_id to null
        { new: true } // Return the updated document
    );

    // Check if the contact was found and updated
    if (!updatedContact) {
        console.log('Contact not found.');
        throw new Error('Contact not found');
    } else {
        console.log(`Account ID removed from contact: ${updatedContact.contact_name}`);
    }
};





export const getContactsByProjectIdService = async (projectId: string): Promise<IContact[]> => {
  try {
    // Validate projectId
    if (!Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }

    const contacts = await Contact.find({ project_id: projectId });
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts for project:', error);
    throw new Error('Unable to fetch contacts for this project');
  }
};
 
// Service to remove a project ID from a contact's project_ids array
export const removeProjectIdService = async (contactId: string, projectId: string): Promise<void> => {
  try {
    // Validate that contactId and projectId are valid ObjectIds
    if (!Types.ObjectId.isValid(contactId) || !Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid contact or project ID');
    }

    // Update the contact to remove the specified project_id from the project_ids array
    const updateResult = await Contact.findByIdAndUpdate(
      contactId,
      { $unset: { project_id: "" } }, // Unset the project_id field
      { new: true } // Return the updated document
    );
    

    if (!updateResult) {
      throw new Error(`Contact with ID ${contactId} not found`);
    }
  } catch (error) {
    console.error(`Error removing project ID from contact ${contactId}:`, error);
    throw new Error('Failed to remove project ID from contact');
  }
};



//Get Contacts by Org Id
export const getContactsByOrgIdService = async (org_id: string): Promise<IContact[] | null> => {
  return await Contact.find({ org_id }); // Query using org_id, not id
};




export const addDealToContactService = async (contactId: string, dealId: string): Promise<void> => {
  // Validate ObjectId
  if (!Types.ObjectId.isValid(contactId) || !Types.ObjectId.isValid(dealId)) {
    throw new Error('Invalid contactId or dealId');
  }

  // Add the new deal ID to `deal_ids` using $addToSet to avoid duplicates
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { $addToSet: { deal_ids: dealId } },
    { new: true } // Return the updated document
  );

  if (!updatedContact) {
    throw new Error(`Contact with ID ${contactId} not found`);
  }

  // Fetch all deals associated with the updated `deal_ids`
  try {
    const response = await axios.post('http://localhost:5002/api/deals/values', {
      deal_ids: updatedContact.deal_ids,
    });

    if (response.data && response.data.deals) {
      // Calculate the total deal value and forecast value
      const totalDealValue = response.data.deals.reduce(
        (sum: number, deal: { deal_value: string }) => sum + parseFloat(deal.deal_value),
        0
      );

      const totalForecastValue = response.data.deals.reduce(
        (sum: number, deal: { forecast_value: string }) => sum + parseFloat(deal.forecast_value),
        0
      );

      // Update the contact with the new total deal value and forecast value
      updatedContact.deal_value = totalDealValue;
      updatedContact.forecast_value = totalForecastValue;
      await updatedContact.save(); // Save the updated values
    }
  } catch (error) {
    console.error('Failed to fetch deal values or update contact:', error);
    throw new Error('Failed to update contact with deal values');
  }
};










export const addProjectToContactService = async (contactId: string, projectId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(contactId) || !Types.ObjectId.isValid(projectId)) {
    throw new Error('Invalid contactId or projectId');
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { $addToSet: { project_ids: projectId } },
      { new: true }
    );

    if (!updatedContact) {
      throw new Error(`Contact with ID ${contactId} not found`);
    }
  } catch (error) {
    console.error('Failed to update contact:', error);
    throw new Error('Failed to update contact with project');
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



// async function accountExists(accountId: string): Promise<boolean> {
//   try {
//       const response = await axios.get(`http://localhost:5003/api/accounts/${accountId}`);
//       return response.status === 200; // If the response is OK, the account exists
//   } catch (error) {
//       // If the account is not found (404), return false
//       if (axios.isAxiosError(error) && error.response?.status === 404) {
//           return false;
//       }
//       // Log unexpected errors
//       console.error('Error checking account existence:', error);
//       throw new Error('Could not verify account existence');
//   }
// }