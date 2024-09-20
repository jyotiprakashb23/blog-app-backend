import express from "express";
import { AllUsers } from "../controllers/AdminController.js";

const router = express.Router();

router.get("/alldata", AllUsers);

export default router;
