import { Router } from "express";
import { addDealToContact, addProjectToContact, createContact, deleteContact, getAllContacts, getContact, getContactsByAccountId, getContactsByDealId, getContactsByOrgId, getContactsByProjectId, removeAccountId, removeDealId, removeProjectId, updateContact} from "../controllers/contactController";

const router = Router();

router.post('/contacts',createContact);

router.get('/contacts',getAllContacts);

router.get('/contacts/:id',getContact);

router.put('/contacts/:id',updateContact);

router.delete('/contacts/:id',deleteContact);

router.get('/contacts/deals/:dealId', getContactsByDealId);

router.patch('/contacts/:id/remove-deal',removeDealId);

router.get('/contacts/accounts/:accountId', getContactsByAccountId);

router.patch('/contacts/:id/remove-account',removeAccountId);

router.get('/contacts/projects/:projectId',getContactsByProjectId);

router.patch('/contacts/:id/remove-project',removeProjectId);


// Route to get Contacts by orgId
router.get('/contacts/orgs/:org_id',getContactsByOrgId);

router.patch('/contacts/:contactId/add-deal',addDealToContact);

router.patch('/contacts/:contactId/add-project',addProjectToContact);


//router.put('/contacts/deals/:id',updateContactDealValue);

export default router;