// src/types/crm/Account.ts
export interface Account {
    id: number;
    name: string;
    priority: 'High' | 'Medium' | 'Low';
    industry: string;
    description: string;
    numEmployees: number;
    hqLocation: string;
  }
  