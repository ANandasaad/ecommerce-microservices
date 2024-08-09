import { requiredAuth, validate } from "@akticketorg/commondir";
import express from "express";
import { TicketValidator } from "../validators/ticket.validator";
import { TicketController } from "../controllers/ticketController";
const router = express.Router();

router.post(
  "/create-ticket",
  requiredAuth,
  TicketValidator.createTicket,
  validate,
  TicketController.createTicket
);
router.get("/get-ticket");

export default router;
