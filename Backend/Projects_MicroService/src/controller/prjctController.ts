import { Project } from "../models/Project"
import { Request,Response } from "express";
import * as projectService from "../services/projectService";

//Create Client_Project
export const createProject = async(req:Request,res: Response)=>{
    try{
        const savedProject = await projectService.createProjectService(req.body);
        res.status(201).json(savedProject);
    }
    catch(error){
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error creating Project' });
    }
}

//Get All Projects
export const getAllProject = async(req:Request,res: Response)=>{
    try{
        const projects = await projectService.getAllProjectsService();
        res.status(200).json(projects);
    }
    catch(error){
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching projects' });
    }
}

//Get a Project
export const getProject = async(req:Request, res: Response)=>{
    try{
        const project = await projectService.getProjectService(req.params.id);
        if (!project) res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    }
    catch(error){
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching project' });
    }
}


//Update a Project
export const updateProject = async(req:Request, res:Response)=>{
    try{
        const updatedProject = await projectService.updateProjectService(req.params.id,req.body);
        if (!updatedProject)  res.status(404).json({ message: 'Project not found' });
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error updating project' });
    }   
}

//Delete a Project
export const deleteProject = async(req:Request,res:Response)=>{
    try{
        const deletedProject = await projectService.deleteProjectService(req.params.id);
        if (!deletedProject)  res.status(404).json({ message: 'Project not found' });
        res.status(204).json({message: 'Deleted successfully!'});
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error deleting project' });
    }
}
