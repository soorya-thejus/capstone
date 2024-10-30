import { Router } from "express";
import { addUser, deleteUser, getAllUsers, getUserDetails, login, register, updateUser, validateToken } from "../controllers/authController";

const router = Router();

router.post('/', addUser);
router.get('/get/:id', getUserDetails);
router.put('/get/:id', updateUser);
router.delete('/get/:id', deleteUser);
router.get('/get', getAllUsers);
router.post('/register', register);
router.post('/login', login);
router.get('/validateToken', validateToken);

export default router;