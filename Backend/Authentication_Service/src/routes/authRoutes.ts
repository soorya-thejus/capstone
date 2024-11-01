import { Router } from "express";
import { createAdminUser, createSalesRepUser, deleteUser, getAllUsers, getUserDetails, login, register, updateUser, validateToken } from "../controllers/authController";


const router = Router();

router.post('/users/admin',createAdminUser);
router.post('/user/sales-rep',createSalesRepUser);


router.get('/get/:id', getUserDetails);
router.put('/get/:id', updateUser);
router.delete('/get/:id', deleteUser);
router.get('/get', getAllUsers);



router.post('/register', register);
router.post('/login', login);
router.get('/validateToken', validateToken);

export default router;