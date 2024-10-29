import { Request, Response } from "express";
import * as contactService from "../services/contactService";
import { Contact } from "../models/Contacts";

export const createContact = async (req: Request, res: Response) => {
    try {
        const savedContact = await contactService.createContactService(req.body);
        res.status(201).json(savedContact);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error creating contact' });
    }
};

export const getAllContacts = async (req: Request, res: Response) => {
    try {
        const contacts = await contactService.getAllContactsService();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching contacts' });
    }
};

export const getContact = async (req: Request, res: Response) => {
    try {
        const contact = await contactService.getContactByIdService(req.params.id);
        if (!contact)  res.status(404).json({ message: 'Contact not found' });
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching contact' });
    }
};

export const updateContact = async (req: Request, res: Response) => {
    try {
        const updatedContact = await contactService.updateContactService(req.params.id, req.body);
        if (!updatedContact)  res.status(404).json({ message: 'Contact not found' });
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error updating contact' });
    }
};

export const deleteContact = async (req: Request, res: Response) => {
    try {
        const deletedContact = await contactService.deleteContactService(req.params.id);
        if (!deletedContact)  res.status(404).json({ message: 'Contact not found' });
        res.status(204).json({ message: 'Deleted successfully!' });
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error deleting contact' });
    }
};


export const getContactsByDealId = async (req: Request, res: Response) => {
    const { dealId } = req.params; // Extract deal ID from the request parameters

    try {
        // Use the service function to fetch contacts by deal ID
        const contacts = await contactService.getContactsByDealIdService(dealId);

        if (contacts.length === 0) {
            res.status(404).json({ message: 'No contacts found for this deal' });
        }

        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching contacts' });
    }
};


export const removeDealId = async (req: Request, res: Response) => {
    const { id } = req.params; // Contact ID
    const { deal_id } = req.body; // Deal ID to remove
  
    try {
      // Call the service to remove the deal_id from the contact's deal_ids
      await contactService.removeDealIdServcie(id, deal_id);
      res.status(200).json({ message: 'Deal ID removed successfully' });
    } catch (error) {
      // Check if the error has a specific message and respond accordingly
      res.status(500).json({ message: error instanceof Error ? error.message : 'Error removing deal ID' });
    }
  };




export const getContactsByAccountId = async(req:Request, res:Response)=>{
    const {accountId} = req.params;
    try{
        const contacts= await contactService.getContactsByAccountIdService(accountId);
        if (contacts.length === 0) {
            res.status(404).json({ message: 'No contacts found for this account' });
        }

        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching contacts' });
    }
    
}
 

export const removeAccountId = async(req:Request, res:Response)=>{
    const { id } = req.params; // Contact ID
    const { account_id } = req.body; // Account ID to remove
  
    try {
      // Call the service to remove the account_id from the contact's account_ids
      await contactService.removeAccountIdServcie(id, account_id);
      res.status(200).json({ message: 'Account ID removed successfully' });
    } catch (error) {
      // Check if the error has a specific message and respond accordingly
      res.status(500).json({ message: error instanceof Error ? error.message : 'Error removing account ID' });
    }
}



export const getContactsByProjectId = async(req:Request, res:Response)=>{
    const {projectId} = req.params;
    try{
        const contacts= await contactService.getContactsByProjectIdService(projectId);
        if (contacts.length === 0) {
            res.status(404).json({ message: 'No contacts found for this project' });
        }

        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching contacts' });
    }
    
}

 
export const removeProjectId = async(req:Request, res:Response)=>{
    const { id } = req.params; // Contact ID
    const { project_id } = req.body; // Project ID to remove
  
    try {
      // Call the service to remove the project_id from the contact's project_ids
      await contactService.removeProjectIdService(id, project_id);
      res.status(200).json({ message: 'Project ID removed successfully' });
    } catch (error) {
      // Check if the error has a specific message and respond accordingly
      res.status(500).json({ message: error instanceof Error ? error.message : 'Error removing project ID' });
    }
}


export const getContactsByOrgId = async (req: Request, res: Response) => {
    const { org_id } = req.params;
    try {
        const contacts = await contactService.getContactsByOrgIdService(org_id);
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error fetching contacts for org_id:", error);
        res.status(500).json({ message: 'Error fetching contacts for this organization' });
    }
};



// Update the deal value of a contact by ID
// export const updateContactDealValue = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const { deal_value } = req.body;

//     if (typeof deal_value !== 'number') {
//         res.status(400).json({ message: 'deal_value must be a number' });
//     }

//     try {
//         // Call the service to update the contact's deal value
//         const updatedContact = await contactService.updateContactDealValueService(id, deal_value);

//         if (!updatedContact) {
//             res.status(404).json({ message: 'Contact not found' });
//         }

//         res.status(200).json(updatedContact);
//     } catch (error) {
//         res.status(500).json({ message: error instanceof Error ? error.message : 'Error updating contact' });
//     }
// };
