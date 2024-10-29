import { Router } from "express";
import { createOrganization, deleteOrganization, getAllOrganizations, getOrganization, updateOrganization } from "../controller/orgController";
//import { createProject, deleteProject, getAllProject, getProject, updateProject } from "../controller/prjctController";


const router = Router();


router.post('/orgs',createOrganization);

router.get('/orgs',getAllOrganizations);

router.get('/orgs/:id',getOrganization);

router.put('/orgs/:id',updateOrganization);

router.delete('/orgs/:id',deleteOrganization);

export default router;