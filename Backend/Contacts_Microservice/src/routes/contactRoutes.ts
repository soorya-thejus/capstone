import { Router } from "express";
import { createContact, deleteContact, getAllContacts, getContact, updateContact } from "../controllers/contactController";

const router = Router();

router.post('/contacts',createContact);

router.get('/contacts',getAllContacts);

router.get('/contacts/:id',getContact);

router.put('/contacts/:id',updateContact);

router.get('/contacts/:id',deleteContact);

export default router;