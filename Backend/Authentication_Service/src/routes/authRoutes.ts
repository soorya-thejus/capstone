import { Router } from "express";
import { createAdminUser, createAndLinkOrganization, createSalesRepUser, deleteUser, getAllUsers, getSalesRepsByOrganization, getUserDetails, login, registerAdmin, registerSalesRep, updateUser, validateToken } from "../controllers/authController";


const router = Router();

router.post('/users/admin',createAdminUser);
router.post('/user/sales-rep',createSalesRepUser);


router.get('/get/:id', getUserDetails);
router.put('/get/:id', updateUser);
router.delete('/get/:id', deleteUser);
router.get('/get', getAllUsers);

router.get('/orgs/:org_id/salesreps',getSalesRepsByOrganization);


router.post('/auth/linkOrg',createAndLinkOrganization);
router.post('/auth/register/admin', registerAdmin);
router.post('/auth/register/salesRep', registerSalesRep);

router.post('/auth/login', login);
router.get('/validateToken', validateToken);

export default router;