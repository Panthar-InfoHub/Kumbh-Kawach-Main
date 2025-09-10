import { googleLoginCallback } from "@/controllers/auth.controller.js";
import { Router } from "express";

const router = Router();



/*
* This callback is triggered each time a user signs-up or signs in
* Handles Onboarding the user and sending login email
* */
router.post("/google/callback", googleLoginCallback);



export default router;
