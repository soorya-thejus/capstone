// src/types/crm/Project.ts
export interface Project {
  _id?: string; // Optional for new projects
  project_name: string;
  priority: 'high' | 'medium' | 'low';
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  status: string;
  contact_id?: string; // Optional, reference to a contact
  org_id: string; // Organization ID reference
  owner_id: string; // User ID reference
}
