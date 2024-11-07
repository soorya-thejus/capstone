import express from 'express';
import { fetchMetricsByOrg, updateMetricsFromDeal, updateMetricsFromLead } from '../controllers/metricsController';


const router = express.Router();


router.post('/metrics/deals', updateMetricsFromDeal);

router.post('/metrics/leads', updateMetricsFromLead)

router.get('/metrics/orgs/:org_id', fetchMetricsByOrg);

export default router;
