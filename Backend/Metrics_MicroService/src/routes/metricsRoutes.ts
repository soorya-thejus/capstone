// routes/metricsRoutes.ts
import express from 'express';
import { updateMetrics } from '../controllers/metricsController';

const router = express.Router();

// Route to manually trigger the dashboard metrics update
router.post('/metrics', updateMetrics);

export default router;
