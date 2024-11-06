import { Router } from "express";
import { createProject, deleteProject, getAllProject, getProject, getProjectsByOrgId, getProjectsByPm, getProjectsBySalesRep, updateProject } from "../controller/prjctController";


const router = Router();


router.post('/projects',createProject);

router.get('/projects',getAllProject);

router.get('/projects/:id',getProject);

router.put('/projects/:id',updateProject);

router.delete('/projects/:id',deleteProject);

// Route to get Projects by orgId
router.get('/projects/orgs/:org_id',getProjectsByOrgId);

// Route to get Projects by sales_rep for an org
router.get('/projects/orgs/:org_id/pms/:owner_id',getProjectsByPm);

router.get('/projects/orgs/:org_id/salesreps/:rep_id',getProjectsBySalesRep);
//router.get('/projects/orgs/:org_id/')

export default router;