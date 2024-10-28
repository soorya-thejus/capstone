// src/types/types.ts
export interface Contact {
    id: number;
    name: string;
    account: string; // Account associated with the contact
    deals: string; // Deals associated with the contact
    project: string; // Single project associated with the contact
    priority: string; // Priority level
    phone: string; // Contact phone number
    email: string; // Contact email
    dealsValue: number; // Value of deals associated with the contact
  }
  