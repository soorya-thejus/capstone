import { Router } from 'express';
import { createLead, deleteLead, getLeadById, getLeads, getLeadsByOrgId, getLeadsBySalesRep, updateLead} from '../controllers/leadController';

const router = Router();

// Route to get all Leads
router.get('/leads', getLeads);

// Route to create a new Lead
router.post('/leads', createLead);

// Route to get a Lead by ID
router.get('/leads/:id', getLeadById);

// Route to update a Lead by ID
router.put('/leads/:id', updateLead);

// Route to delete a Lead by ID
router.delete('/leads/:id', deleteLead);






//--------------------------------------------------------

// Route to get Leads by orgId
router.get('/leads/orgs/:org_id',getLeadsByOrgId);

// Route to get Leads by sales_rep for an org
router.get('/leads/orgs/:org_id/salesreps/:owner_id',getLeadsBySalesRep);


export default router;

