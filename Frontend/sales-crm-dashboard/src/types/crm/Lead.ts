// src/types/crm/Lead.ts
export interface Lead {
  id?: string; // Use string to match MongoDB ObjectId
  lead_name: string;
  status: 'new lead' | 'attempted to contact' | 'contacted' | 'qualified' | 'unqualified';
  company: string;
  title: string;
  email: string;
  phone: string;
}
