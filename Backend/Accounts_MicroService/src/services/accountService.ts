// src/services/AccountService.ts
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
    return await Account.findByIdAndDelete(id);
};
