// src/types/crm/Project.ts
export interface Project {
    id: number;
    name: string;
    priority: "High" | "Medium" | "Low";
    startDate: string;
    endDate: string;
    status: "Not Started" | "In Progress" | "Completed";
  }
  