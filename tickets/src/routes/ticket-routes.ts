import { currentUser, requiredAuth, validate } from "@akticketorg/commondir";
import express from "express";
import { TicketValidator } from "../validators/ticket.validator";
import { TicketController } from "../controllers/ticketController";
import { TicketRepo } from "../repositories/ticket.repo";
const router = express.Router();

router.post(
  "/create-ticket",
  requiredAuth,
  TicketValidator.createTicket,
  validate,
  TicketController.createTicket
);
router.get("/get-tickets", requiredAuth, TicketController.getTicket);
router.get(
  "/get-ticket/:ticketId",
  requiredAuth,
  TicketController.getTicketById
);
router.patch(
  "/update-ticket/:ticketId",
  requiredAuth,
  TicketValidator.updateTickets,
  validate,
  TicketController.updateTicket
);

export default router;
