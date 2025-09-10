import { createContact, deleteContact, getContacts, updateContact } from "@/controllers/contact.controller";
import user_id_checker from "@/middlewares/user_id_checker";
import { Router } from "express";

const router = Router({mergeParams: true}); // mounted at /v2/user/:user_id/contacts

router.use(user_id_checker); // Middleware that checks for user_id in the req.params

router.get("/", getContacts); // Get all emergency contacts of the user

router.post("/", createContact); // Create a New contact for a user

router.put("/:contact_id", updateContact); // Update an existing contact

router.delete("/:contact_id", deleteContact); // Delete a contact


export default router;
