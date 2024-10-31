// controllers/metricsController.ts
import { Request, Response } from 'express';
import {  updateMetricsFromDealEvent } from '../services/metricsService';

// export const updateMetrics = async (req: Request, res: Response): Promise<void> => {
//   try {
//     await updateDashboardMetrics();
//     res.status(200).json({ message: 'Dashboard metrics updated successfully' });
//   } catch (error) {
//     console.error('Error updating dashboard metrics:', error);
//     res.status(500).json({ message: 'Failed to update dashboard metrics' });
//   }
// };

export const updateMetricsFromDeal = async (req: Request, res: Response): Promise<void> => {
    try {
      const dealData = req.body; // Assuming the deal data is sent in the request body
      await updateMetricsFromDealEvent(dealData);
      res.status(200).json({ message: 'Metrics updated from deal event successfully' });
    } catch (error) {
      console.error('Error updating metrics from deal event:', error);
      res.status(500).json({ message: 'Failed to update metrics from deal event' });
    }
  };
