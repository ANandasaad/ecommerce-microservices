import { body } from "express-validator";

export const PaymentValidator = {
  createPayment: [
    body("token").not().isEmpty().withMessage("token is required").bail(),
    body("orderId")
      .not()
      .isEmpty()
      .withMessage("orderId is required")
      .isMongoId()
      .withMessage("OrderId must be mongo_id")
      .bail(),
  ],
};
