// controllers/metricsController.ts
import { Request, Response } from 'express';
import { updateDashboardMetrics } from '../services/metricsService';

export const updateMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    await updateDashboardMetrics();
    res.status(200).json({ message: 'Dashboard metrics updated successfully' });
  } catch (error) {
    console.error('Error updating dashboard metrics:', error);
    res.status(500).json({ message: 'Failed to update dashboard metrics' });
  }
};
