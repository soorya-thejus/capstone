// src/types/crm/Contact.ts
export interface Contact {
  _id?: string; // Optional for new contacts
  lead_id: string;
  contact_name: string;
  account_id?: string | null; 
  deal_ids?: string[];
  title: string;
  email: string;
  phone: string;
  priority: 'high' | 'medium' | 'low';
  deal_value?: number;
  forecast_value?: number;
  project_ids?: string[];
  org_id: string;
}
