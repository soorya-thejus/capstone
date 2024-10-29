// src/services/leadService.ts
import axios from 'axios';
import { Lead } from '../types/crm/Lead';

const BASE_URL = 'http://localhost:5001/api/leads'; // Adjust this to your backend URL

export const getLeads = async (): Promise<Lead[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createLead = async (lead: Lead): Promise<Lead> => {
  const response = await axios.post(BASE_URL, lead);
  return response.data;
};

export const updateLead = async (id: string, lead: Lead): Promise<Lead> => {
  const response = await axios.put(`${BASE_URL}/${id}`, lead);
  return response.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
