import { Router } from "express";
import { 
  createDeal, 
  deleteDeal, 
  getDealById, 
  getDeals, 
  getDealsByOrgId, 
  getDealValues, 
  updateDeal 
} from "../controllers/dealController";

const router = Router();

// Route for creating a new deal
router.post('/deals', createDeal);

// Route for getting all deals
router.get('/deals', getDeals);

// Route for getting a single deal by ID
router.get('/deals/:id', getDealById);

// Route for updating a deal by ID
router.put('/deals/:id', updateDeal);

// Route for deleting a deal by ID
router.delete('/deals/:id', deleteDeal);

// Route for retrieving deal values based on deal_ids (changed to POST for payload support)
router.post('/deals/values', getDealValues);

// Route to get Deals by orgId
router.get('/deals/orgs/:org_id',getDealsByOrgId);

export default router;
