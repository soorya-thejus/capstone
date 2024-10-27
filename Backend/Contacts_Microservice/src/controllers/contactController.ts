import { Contact } from "../models/Contacts"
import { Request,Response } from "express";

//Create Contact
export const createContact = async(req:Request, res:Response)=>{
    try{
        const newContact = new Contact(req.body);
        const savedContact = await newContact.save();
        res.status(201).json(savedContact);
    }
    catch(error){
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error creating Contact' });
    }
}


//Get All Contacts
export const getAllContacts = async(req:Request, res:Response)=>{
    try{
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    }
    catch(error){
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching contacts' });
    }
}


//Get a Contact
export const getContact=async(req:Request,res:Response)=>{
    try{
        const contact = await Contact.findById(req.params.id);
        if (!contact) res.status(404).json({ message: 'Contact not found' });
        res.status(200).json(contact);
    }
    catch(error){
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching contact' });
    }
}


//Update Contact
export const updateContact = async(req:Request,res:Response)=>{
    try{
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if (!updatedContact)  res.status(404).json({ message: 'Contact not found' });
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error updating conatct' });
    }
}


//Delete Contact
export const deleteContact = async(req:Request,res:Response)=>{
    try{
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact)  res.status(404).json({ message: 'Contact not found' });
        res.status(204).json({message: 'Deleted successfully!'});
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error deleting contact' });
    }
}


