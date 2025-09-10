import {Router} from "express";
import { createTicket, deleteTicket, getUserTickets, closeTicket,  getLatestLocation, addTicketLocation, getTicketDetailsById, getTicketStatus, getTicketSummary} from "@/controllers/ticket.controller";
import user_id_checker from "@/middlewares/user_id_checker";
import {addTicketImage, addTicketVideo, addTicketAudio} from "@/controllers/ticket.media.controller";

const router = Router({mergeParams: true}); // mounted at /v2/user/:user_id/tickets

router.use(user_id_checker);

router.post("/", createTicket); // Create a new ticket

router.get("/", getUserTickets); // Get user's tickets

router.get("/:ticket_id", getTicketDetailsById); // Get a ticket's details
router.get("/:ticket_id/status", getTicketStatus); // Get a ticket's status only
router.get("/:ticket_id/location", getLatestLocation); // Get a ticket's latest location only
router.get("/:ticket_id/summary", getTicketSummary); // Get a ticket's summary only


router.post("/:ticket_id/audio", addTicketAudio); // Insert audio
router.post("/:ticket_id/video", addTicketVideo); // Insert Video
router.post("/:ticket_id/image", addTicketImage); // Insert Image
router.post("/:ticket_id/location", addTicketLocation); // Insert location
router.put("/:ticket_id/close", closeTicket); // Close the ticket

router.delete("/:ticket_id", deleteTicket); // Delete the ticket and all associated data


export default router;
