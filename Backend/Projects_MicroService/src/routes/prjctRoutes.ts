import { Router } from "express";
import { createProject, deleteProject, getAllProject, getProject, updateProject } from "../controller/prjctController";


const router = Router();


router.post('/projects',createProject);

router.get('/projects',getAllProject);

router.get('/projects/:id',getProject);

router.put('/projects/:id',updateProject);

router.delete('/projects/:id',deleteProject);

export default router;