// services/AuthService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5007/api'; // Replace with your actual API endpoint

export const registerAdmin = async (data: { organizationName: string; email: string; password: string }) => {
  return axios.post(`${API_URL}/auth/register/admin`, data);
};

export const registerSalesRep = async (data: { org_id: string; username: string; email: string; password: string; role: string; }) => {
  return axios.post(`${API_URL}/auth/register/salesRep`, data);
};

export const login = async (data: { email: string; password: string }) => {
  return axios.post(`${API_URL}/auth/login`, data);
};

export const linkOrganization = async (data: { name: string; type: string; address: string; contact_info: string; user_id: string | null }) => {
  return axios.post(`${API_URL}/auth/linkOrg`, data);
};

export const logout = () => {
  sessionStorage.clear(); // Clear all session data on logout
};
