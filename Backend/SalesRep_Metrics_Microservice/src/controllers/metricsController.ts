import { Request, Response } from 'express';
import { getMetricsBySalesRepService, updateSalesRepMetricsFromDealEvent } from '../services/metricsService';


export const updateMetricsFromDeal = async (req: Request, res: Response) => {
    try {
      const dealData = req.body; // Assuming the deal data is sent in the request body
      await updateSalesRepMetricsFromDealEvent(dealData);
      res.status(200).json({ message: 'Metrics updated from deal event successfully' });
    } catch (error) {
      console.error('Error updating metrics from deal event:', error);
      res.status(500).json({ message: 'Failed to update metrics from deal event' });
    }
  };


  export const fetchMetricsBySalesRep = async (req: Request, res: Response) => {
    try {
      const { org_id } = req.params;
      const metrics = await getMetricsBySalesRepService(org_id);
      
      res.status(200).json(metrics);
    } catch (error) {
      console.error('Error fetching metrics', error);
      res.status(500).json({ message: 'Failed to fetch metrics' });
    }
  };