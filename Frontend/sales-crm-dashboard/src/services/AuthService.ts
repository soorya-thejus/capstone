import axios from 'axios';

const API_URL = 'https://api.yourcrm.com'; // Replace with your actual API endpoint

export const signup = async (data: { organizationName: string; email: string; password: string }) => {
  return axios.post(`${API_URL}/auth/signup`, data);
};

export const signin = async (data: { email: string; password: string }) => {
  return axios.post(`${API_URL}/auth/signin`, data);
};

export const logout = () => {
  localStorage.removeItem('token'); // Clear token or session info
};
