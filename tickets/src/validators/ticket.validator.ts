import { body } from "express-validator";

export const TicketValidator = {
  createTicket: [
    body("Title").trim().notEmpty().withMessage("Title cannot be empty").bail(),
    body("Price")
      .isFloat({
        gt: 0,
      })
      .withMessage("Price must be greater than zero"),
  ],
};
