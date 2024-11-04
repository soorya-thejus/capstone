// src/types/Deal.ts
export interface Deal {
  _id?: string; // Using _id instead of id for MongoDB compatibility
  deal_name: string;
  stage: 'new' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost';
  deal_value: number;
  expected_close_date: string; // Use string for date input compatibility
  close_probability: number;
  forecast_value: number;
  contact_id: string; // Added contact_id for selected contact
  org_id: string; // Ensure org_id is part of the deal
  owner_id: string; // Ensure owner_id is part of the deal
}
