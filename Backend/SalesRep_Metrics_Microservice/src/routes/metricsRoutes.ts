import express from 'express';
import { fetchMetricsBySalesRep, updateMetricsFromDeal, updateMetricsFromLead } from '../controllers/metricsController';


const router = express.Router();

router.post('/salesRepMetrics/deals', updateMetricsFromDeal);

router.post('/salesRepMetrics/leads', updateMetricsFromLead);

router.get('/metrics/salesRep/:owner_id', fetchMetricsBySalesRep);

export default router;
