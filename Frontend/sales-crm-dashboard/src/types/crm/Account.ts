// src/types/crm/Account.ts
export interface Account {
  id: number;
  account_name: string;
  priority: 'high' | 'medium' | 'low';
  industry: string;
  description: string;
  number_of_employees: number;
}
