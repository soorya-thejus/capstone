// src/services/contactService.ts
import axios from 'axios';
import { Contact } from '../types/crm/Contact';

const API_URL = 'http://localhost:5005/api/contacts'; // Adjust the URL based on your backend

export const ContactService = {
  getAllContactsByOrgId: async (orgId: string): Promise<Contact[]> => {
    const response = await axios.get(`${API_URL}/orgs/${orgId}`);
    return response.data;
  },

  getAllContactsBySalesRep: async (orgId: string, ownerId: string): Promise<Contact[]> => {
    const response = await axios.get(`${API_URL}/orgs/${orgId}/salesreps/${ownerId}`);
    return response.data;
  },

  createContact: async (contact: Contact): Promise<Contact> => {
    const response = await axios.post(API_URL, contact);
    return response.data;
  },

  updateContact: async (contactId: string, contact: Partial<Contact>): Promise<Contact> => {
    const response = await axios.put(`${API_URL}/${contactId}`, contact);
    return response.data;
  },

  deleteContact: async (contactId: string): Promise<void> => {
    await axios.delete(`${API_URL}/${contactId}`);
  },
};

export function getAllContacts(orgId: string) {
  throw new Error('Function not implemented.'); // You may remove this if it's not necessary
}
