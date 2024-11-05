export interface Account {
  _id: string;
  account_name: string;
  priority: 'high' | 'medium' | 'low';
  industry: string;
  description: string;
  number_of_employees: number;
  org_id: string; // Include org_id
  owner_id: string;
}
