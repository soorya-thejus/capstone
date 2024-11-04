import express from 'express';
import { fetchMetricsByOrg, updateMetricsFromDeal } from '../controllers/metricsController';


const router = express.Router();


router.post('/metrics', updateMetricsFromDeal);

router.get('/metrics/orgs/:org_id', fetchMetricsByOrg);

export default router;
