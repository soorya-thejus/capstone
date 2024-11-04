// src/services/dealService.ts
import axios from 'axios';
import { Deal } from '../types/crm/Deal';

const API_URL = 'http://localhost:5002/api/deals'; // Adjust the URL based on your backend

export const DealService = {
  getAllDealsByOrgId: async (orgId: string): Promise<Deal[]> => {
    const response = await axios.get(`${API_URL}/orgs/${orgId}`);
    return response.data;
  },

  getAllDealsBySalesRep: async (orgId: string, ownerId: string): Promise<Deal[]> => {
    const response = await axios.get(`${API_URL}/orgs/${orgId}/salesrep/${ownerId}`);
    return response.data;
  },

  createDeal: async (deal: Deal): Promise<Deal> => {
    const response = await axios.post(API_URL, deal);
    return response.data;
  },

  updateDeal: async (dealId: string, deal: Partial<Deal>): Promise<Deal> => {
    const response = await axios.put(`${API_URL}/${dealId}`, deal);
    return response.data;
  },

  deleteDeal: async (dealId: string): Promise<void> => {
    await axios.delete(`${API_URL}/${dealId}`);
  },
};
