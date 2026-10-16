

import { Router } from "express";
import { memberLogin } from '../controllers/member.login.controller.js';


const router = Router();
router.post('/login', memberLogin);

export default router;


