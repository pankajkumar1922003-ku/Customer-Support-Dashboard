
import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicketSummary,
  getTicketById,
  updateTicket,
} from "../controllers/ticketController.js";

const router = Router();

router.get("/summary", getTicketSummary);

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);
router.patch("/:id", updateTicket);

export default router;