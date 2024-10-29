// src/types/Deal.ts
export interface Deal {
    id: number;
    name: string;
    stage: string;
    dealValue: number;
    expectedCloseDate: string;
    closeProbability: number;
    forecastValue: number;
  }
  