import { Router } from "express";
import { createOrganization, deleteOrganization, getAccountsByOrgId, getAllOrganizations, getContactsByOrgId, getDealsByOrgId, getLeadsByOrgId, getOrganization, getProjectsByOrgId, updateOrganization } from "../controller/orgController";
//import { createProject, deleteProject, getAllProject, getProject, updateProject } from "../controller/prjctController";


const router = Router();


router.post('/orgs',createOrganization);

router.get('/orgs',getAllOrganizations);

router.get('/orgs/:id',getOrganization);

router.put('/orgs/:id',updateOrganization);

router.delete('/orgs/:id',deleteOrganization);

router.get('/orgs/:orgId/leads',getLeadsByOrgId);

router.get('/orgs/:orgId/deals',getDealsByOrgId);

router.get('/orgs/:orgId/accounts',getAccountsByOrgId);

router.get('/orgs/:orgId/projects',getProjectsByOrgId);

router.get('/orgs/:orgId/contacts',getContactsByOrgId);


export default router;