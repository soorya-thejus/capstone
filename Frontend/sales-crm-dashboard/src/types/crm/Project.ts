// src/types/crm/Project.ts
export interface Project {
  id?: string; // Optional for new projects
  project_name: string;
  priority: 'high' | 'medium' | 'low';
  start_date: string; // Consider using Date type if preferred
  end_date: string; // Consider using Date type if preferred
  status: 'not started' | 'working on it' | 'stuck' | 'done';
  contact_id?: string; // Optional if not provided
  org_id: string; // Required, reference to organization
}
