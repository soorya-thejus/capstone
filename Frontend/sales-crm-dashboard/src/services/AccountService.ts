import axios from 'axios';
import { Account } from '../types/crm/Account';

const API_BASE_URL = 'http://localhost:5003/api/accounts';

// Get all accounts for a specific organization
export const getAllAccounts = async (orgId: string) => {
  const response = await axios.get(`${API_BASE_URL}/orgs/${orgId}`);
  return response.data;
};

// Get accounts associated with a specific sales rep
export const getAccountsBySalesRep = async (orgId: string, ownerId: string) => {
  const response = await axios.get(`${API_BASE_URL}/orgs/${orgId}/salesrep/${ownerId}`);
  return response.data;
};

// Create a new account
export const createAccount = async (accountData: Account) => {
  const { _id, ...dataWithoutId } = accountData;
  const response = await axios.post(`${API_BASE_URL}`, dataWithoutId);
  return response.data;
};

// Get a single account by ID
export const getAccount = async (_id: string) => {
  const response = await axios.get(`${API_BASE_URL}/${_id}`);
  return response.data;
};

// Update an account by ID
export const updateAccount = async (_id: string, accountData: Account) => {
  const response = await axios.put(`${API_BASE_URL}/${_id}`, accountData);
  return response.data;
};

// Delete an account by ID
export const deleteAccount = async (_id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/${_id}`);
  return response.data;
};
