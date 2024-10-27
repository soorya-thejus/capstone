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
