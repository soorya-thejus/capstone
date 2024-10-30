import { Router } from "express";
import { createAccount, deleteAccount, getAccount, getAccountsByOrgId, getAllAccount, updateAccount } from "../controllers/accountController";


const router = Router();

router.post('/accounts',createAccount);

router.get('/accounts',getAllAccount);

router.get('/accounts/:id',getAccount);

router.put('/accounts/:id',updateAccount);

router.delete('/accounts/:id',deleteAccount);


// Route to get Accounts by orgId
router.get('/accounts/orgs/:org_id',getAccountsByOrgId);

export default router;