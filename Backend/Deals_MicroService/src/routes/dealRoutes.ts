import { Router } from "express";
import { createDeal, deleteDeal, getDealById, getDeals, updateDeal } from "../controllers/dealController";

const router = Router();

router.post('/deals',createDeal);

router.get('/deals',getDeals);

router.get('/deals/:id',getDealById);

router.put('/deals/:id',updateDeal);

router.delete('/deals/:id',deleteDeal);

export default router;