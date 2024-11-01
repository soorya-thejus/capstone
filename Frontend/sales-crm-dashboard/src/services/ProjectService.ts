import axios from 'axios';
import { Project } from '../types/crm/Project';

const BASE_URL = 'http://localhost:5004/api/projects';

// Fetch all projects for a specific organization
export const fetchProjectsByOrgId = async (orgId: string): Promise<Project[]> => {
  const response = await axios.get<Project[]>(`${BASE_URL}/orgs/${orgId}`);
  return response.data;
};

export const createProject = async (project: Project): Promise<Project> => {
  const response = await axios.post<Project>(`${BASE_URL}`, project);
  return response.data;
};

export const updateProject = async (id: string, project: Project): Promise<Project> => {
  const response = await axios.put<Project>(`${BASE_URL}/${id}`, project);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
