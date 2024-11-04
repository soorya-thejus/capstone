import express from 'express';
import { updateMetricsFromDeal } from '../controllers/metricsController';


const router = express.Router();

router.post('/salesRepMetrics', updateMetricsFromDeal);

//router.get('/metrics/:org_id', getMetricsByOrg);

export default router;
