import express from 'express';
import { fetchMetricsBySalesRep, updateMetricsFromDeal } from '../controllers/metricsController';


const router = express.Router();

router.post('/salesRepMetrics', updateMetricsFromDeal);

router.get('/metrics/salesRep/:owner_id', fetchMetricsBySalesRep);

export default router;
