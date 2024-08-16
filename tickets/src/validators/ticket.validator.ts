import { body, param } from "express-validator";

export const TicketValidator = {
  createTicket: [
    body("Title").trim().notEmpty().withMessage("Title cannot be empty").bail(),
    body("Price")
      .isFloat({
        gt: 0,
      })
      .withMessage("Price must be greater than zero"),
  ],
  updateTickets: [
    body("Title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty")
      .bail(),
    body("Price")
      .optional()
      .isFloat({
        gt: 0,
      })
      .withMessage("Price must be greater than zero"),

    param("ticketId")
      .trim()
      .notEmpty()
      .withMessage(" ticketId cannot be empty ")
      .isMongoId()
      .withMessage("Please enter a valid ticket id")
      .bail(),
  ],
};
