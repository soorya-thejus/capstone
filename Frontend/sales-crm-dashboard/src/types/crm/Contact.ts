// src/types/crm/Contact.ts
export interface Contact {
  id: number;  // Unique identifier for the contact
  lead_id: number;  // Reference to the associated lead
  contact_name: string;  // Full name of the contact
  account_ids: number[];  // Array of associated account IDs
  deal_ids: number[];  // Array of associated deal IDs
  title: string;  // Job title of the contact
  email: string;  // Email address of the contact (should be unique)
  phone: string;  // Phone number of the contact
  priority: 'high' | 'medium' | 'low';  // Priority level for the contact
  deal_value: number;  // Total value of deals associated with this contact
  project_id: number;  // Reference to the associated project
}
