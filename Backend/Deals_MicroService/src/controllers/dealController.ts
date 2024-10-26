import { Deal } from "../models/Deals"
import { Request, Response } from 'express';

//Create a Deal
export const createDeal = async(req: Request, res: Response) =>{
    try{
        const newDeal = new Deal(req.body);
        const savedDeal = await newDeal.save();
        res.status(201).json(savedDeal);
    }
    catch(error){
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error creating Deal' });
    }
}

//Get all Deals
export const getDeals = async(req: Request, res: Response)=>{
    try{
        const deals = await Deal.find();
        res.status(200).json(deals);
    }
    catch(error){
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching deals' });
    }
}


//Get a Deal By Id
export const getDealById = async(req: Request, res: Response)=>{
    try{
        const deal = await Deal.findById(req.params.id);
        if (!deal) res.status(404).json({ message: 'Deal not found' });
        res.status(200).json(deal);
    }
    catch(error){
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching deal' });
    }
}


//Update Deal
export const updateDeal = async(req:Request, res: Response)=>{
    try{
        const updatedDeal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedDeal)  res.status(404).json({ message: 'Deal not found' });
        res.status(200).json(updatedDeal);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error updating deal' });
    }
}


// Delete a deal
export const deleteDeal = async (req: Request, res: Response) => {
    try {
        const deletedDeal = await Deal.findByIdAndDelete(req.params.id);
        if (!deletedDeal)  res.status(404).json({ message: 'Deal not found' });
        res.status(204).json({message: 'Deleted successfully!'});
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error deleting deal' });
    }
};
