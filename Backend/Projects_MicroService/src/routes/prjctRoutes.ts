import { Router } from "express";
import { createProject, deleteProject, getAllProject, getProject, getProjectsByOrgId, updateProject } from "../controller/prjctController";


const router = Router();


router.post('/projects',createProject);

router.get('/projects',getAllProject);

router.get('/projects/:id',getProject);

router.put('/projects/:id',updateProject);

router.delete('/projects/:id',deleteProject);

// Route to get Projects by orgId
router.get('/projects/orgs/:org_id',getProjectsByOrgId);

export default router;