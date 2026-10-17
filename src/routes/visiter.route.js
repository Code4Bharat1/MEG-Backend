import { Router } from "express";
import {createvisitor, visitorLogin} from "../controllers/visiter.controller.js";

const router = Router();

router.post("/create", createvisitor);
router.post("/login", visitorLogin);


export default router;