// src/services/AccountService.ts
import axios from "axios";
import { Account,IAccount } from "../models/Accounts";
import { Types } from "mongoose";

export const createAccountService = async (accountData: Partial<IAccount>): Promise<IAccount> => {
    const newAccount = new Account(accountData);
    return await newAccount.save();
};

export const getAccountService = async (id: string):Promise<IAccount|null> => {
    return await Account.findById(id);
};

export const getAllAccountsService = async ():Promise<IAccount[]> => {
    return await Account.find();
};

export const updateAccountService = async (id: string, accountData: Partial<IAccount>): Promise<IAccount|null> => {
    return await Account.findByIdAndUpdate(id, accountData, { new: true, runValidators: true });
};

export const deleteAccountService = async (id: string):Promise<IAccount|null> => {
    const contacts = await getContactsByAccountId(id);

    for (const contact of contacts) {
        // Make an HTTP request to update the contact in the Contacts Microservice
        await axios.patch(`http://localhost:5005/api/contacts/${contact._id}/remove-account`, { account_id: id });
    }
    return await Account.findByIdAndDelete(id);
};


const CONTACT_MICROSERVICE_URL = 'http://localhost:5005/api/contacts';

// Function to get contacts by account ID
async function getContactsByAccountId(accountId: string) {
    try {
        const response = await axios.get(`${CONTACT_MICROSERVICE_URL}/accounts/${accountId}`);
        return response.data; // Assuming it returns the contacts related to the account
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw new Error('Unable to fetch contacts');
    }
}
