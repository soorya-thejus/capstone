import axios from 'axios';

const API_URL = 'https://api.yourcrm.com'; // Replace with your actual API endpoint

export const fetchWidgetData = async (widgetType: string) => {
  return axios.get(`${API_URL}/widgets/${widgetType}`);
};
