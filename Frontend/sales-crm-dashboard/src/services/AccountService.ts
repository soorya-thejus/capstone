import axios from 'axios';
import { Account } from '../types/crm/Account'; // Make sure this matches your type location

// Base URL for API
const API_BASE_URL = 'http://localhost:5003/api/accounts'; // Update the port and path as needed

// Create a new account
export const createAccount = async (accountData: Account) => {
  const response = await axios.post(`${API_BASE_URL}`, accountData);
  return response.data;
};

// Get a single account by ID
export const getAccount = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

// Get all accounts
export const getAllAccounts = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data;
};

// Update an account by ID
export const updateAccount = async (id: number, accountData: Account) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, accountData);
  return response.data;
};

// Delete an account by ID
export const deleteAccount = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
