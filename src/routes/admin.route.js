import { Router } from "express";
import { adminLogin } from '../controllers/admin.controller.js';

const router = Router();
router.post('/admin', adminLogin);
export default router;
