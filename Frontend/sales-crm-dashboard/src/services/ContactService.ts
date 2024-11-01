// src/services/contactService.ts
import axios from 'axios';
import { Contact } from '../types/crm/Contact';

const API_URL = 'http://localhost:5005/api/contacts'; // Adjust the URL based on your backend

export const ContactService = {
  getAllContacts: async (orgId: string): Promise<Contact[]> => {
    const response = await axios.get(`${API_URL}?org_id=${orgId}`);
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
  }
};
