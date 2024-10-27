import { Router } from "express";
import { createContact, deleteContact, getAllContacts, getContact, getContactsByDealId, updateContact} from "../controllers/contactController";

const router = Router();

router.post('/contacts',createContact);

router.get('/contacts',getAllContacts);

router.get('/contacts/:id',getContact);

router.put('/contacts/:id',updateContact);

router.delete('/contacts/:id',deleteContact);

router.get('/contacts/deals/:dealId', getContactsByDealId);


//router.put('/contacts/deals/:id',updateContactDealValue);

export default router;