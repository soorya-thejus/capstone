import { Account } from "../models/Accounts"
import { Request, Response } from 'express';

//Create a Account
export const createAccount = async(req:Request, res:Response)=>{
    try{
        const newAccount = new Account(req.body);
        const savedAccount = await newAccount.save();
        res.status(201).json(savedAccount);
    }
    catch(error){
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error creating Account' });
    }
}

//Get a Account
export const getAccount = async(req:Request, res:Response)=>{
    try{
        const account = await Account.findById(req.params.id);
        if (!account) res.status(404).json({ message: 'Account not found' });
        res.status(200).json(account);
    }
    catch(error){
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching account' });
    }
}

//Get all Accounts
export const getAllAccount = async(req:Request,res: Response)=>{
    try{
        const accounts = await Account.find();
        res.status(200).json(accounts);
    }
    catch(error){
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching accounts' });
    }
}


//Update a Account
export const updateAccount = async(req:Request, res:Response)=>{
    try{
        const updatedAccount = await Account.findByIdAndUpdate(req.params.id,req.body,{ new: true, runValidators: true });
        if (!updatedAccount)  res.status(404).json({ message: 'Account not found' });
        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error updating account' });
    }
}


//Delete a Account
export const deleteAccount = async(req: Request, res: Response)=>{
    try{
        const deletedAccnt = await Account.findByIdAndDelete(req.params.id);
        if (!deletedAccnt)  res.status(404).json({ message: 'Account not found' });
        res.status(204).json({message: 'Deleted successfully!'});
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error deleting account' });
    }
}