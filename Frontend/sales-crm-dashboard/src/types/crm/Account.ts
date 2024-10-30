// src/types/crm/Account.ts
export interface Account {
  _id: string; // Change number to string if MongoDB ObjectId is being used
  account_name: string;
  priority: 'high' | 'medium' | 'low';
  industry: string;
  description: string;
  number_of_employees: number;
}
