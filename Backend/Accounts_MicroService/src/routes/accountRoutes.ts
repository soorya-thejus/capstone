import { Router } from "express";
import { createAccount, deleteAccount, getAccount, getAllAccount, updateAccount } from "../controllers/accountController";


const router = Router();

router.post('/accounts',createAccount);

router.get('/accounts',getAllAccount);

router.get('/accounts/:id',getAccount);

router.put('/accounts/:id',updateAccount);

router.delete('/accounts/:id',deleteAccount);

export default router;