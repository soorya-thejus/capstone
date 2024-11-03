// routes/metricsRoutes.ts
import express from 'express';
import { updateMetricsFromDeal } from '../controllers/metricsController';
//import { updateMetricsFromDeal } from '../controllers/metricsController';
//import { updateMetrics } from '../controllers/metricsController';

const router = express.Router();

// Route to manually trigger the dashboard metrics update
//router.post('/metrics', updateMetrics);

//router.post('/metrics', updateMetricsFromDeal);


router.post('/metrics', updateMetricsFromDeal);

export default router;
