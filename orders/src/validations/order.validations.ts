import { body } from "express-validator";

export const OrderValidator = {
  createOrder: [
    body("ticketId")
      .not()
      .isEmpty()
      .withMessage("ticket id is required")
      .isMongoId()
      .withMessage("ticket id is must be a valid")
      .bail(),
  ],
};
