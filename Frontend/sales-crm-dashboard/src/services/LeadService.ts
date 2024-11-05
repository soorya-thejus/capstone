// src/services/LeadService.ts
import axios from 'axios';
import { Lead } from '../types/crm/Lead';

const BASE_URL = 'http://localhost:5001/api/leads';

export const getLeadsByOrgId = async (orgId: string): Promise<Lead[]> => {
  const response = await axios.get(`${BASE_URL}/orgs/${orgId}`);
  return response.data;
};

export const getLeadsBySalesRep = async (orgId: string, ownerId: string): Promise<Lead[]> => {
  const response = await axios.get(`${BASE_URL}/orgs/${orgId}/salesreps/${ownerId}`);
  return response.data;
};

export const createLead = async (lead: Lead): Promise<Lead> => {
  const response = await axios.post(BASE_URL, lead);
  return response.data;
};

export const updateLead = async (_id: string, lead: Lead): Promise<Lead> => {
  const response = await axios.put(`${BASE_URL}/${_id}`, lead);
  return response.data;
};

export const deleteLead = async (_id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${_id}`);
};
