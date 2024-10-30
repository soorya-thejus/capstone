
// src/types/crm/Lead.ts
export interface Lead {
  _id?: string; // MongoDB IDs are generally named _id
  lead_name: string;
  status: 'new lead' | 'attempted to contact' | 'contacted' | 'qualified' | 'unqualified';
  company: string;
  title: string;
  email: string;
  phone: string;
  org_id: string; // Optional if not always used in frontend forms
}
