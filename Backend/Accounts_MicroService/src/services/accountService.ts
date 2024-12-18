// src/services/AccountService.ts
import axios from "axios";
import { Account,IAccount } from "../models/Accounts";
import { Types } from "mongoose";
import { log } from "console";

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
 

export const deleteAccountService = async (id: string): Promise<IAccount | null> => {
    try {
        // Retrieve contacts associated with the account ID
        const contacts = await getContactsByAccountId(id);
        console.log(`Found ${contacts.length} contacts associated with account ${id}`);

        // Only attempt to update contacts if any are associated with the account
        if (contacts.length > 0) {
            for (const contact of contacts) {
                try {
                    // Make an HTTP request to update each contact in the Contacts Microservice
                    await axios.patch(`http://localhost:5005/api/contacts/${contact._id}/remove-account`);
                } catch (error) {
                    console.error(`Error updating contact ${contact._id}:`, error);
                    throw new Error('Failed to update contact in Contacts microservice');
                }
            }
        }

        // Delete the account from the Accounts microservice
        return await Account.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error deleting account:', error);
        throw new Error(error instanceof Error ? error.message : 'Error deleting account');
    }
};







const CONTACT_MICROSERVICE_URL = 'http://localhost:5005/api/contacts';

// Function to get contacts by account ID
async function getContactsByAccountId(accountId: string) {
    try {
        const response = await axios.get(`http://localhost:5005/api/contacts/accounts/${accountId}`);
        console.log(response.data);
        
        return response.data || []; // Return an empty array if no data is returned
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw new Error('Unable to fetch contacts for acc');
    }
}



//Get Leads by Org Id
export const getAccountsByOrgIdService = async (org_id: string): Promise<IAccount[] | null> => {
    return await Account.find({ org_id }); // Query using org_id, not id
};


//Get Accounts by Sales Rep in an Org
export const getAccountsBySalesRep = async (org_id: string, owner_id: string): Promise<IAccount[]|null> => {
    // Query for accounts matching both the organization and sales rep (owner) criteria
    const accounts = await Account.find({org_id,owner_id});
    return accounts;
  };