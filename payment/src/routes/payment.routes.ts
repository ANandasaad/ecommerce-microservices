import express from "express";
import { PaymentController } from "../controllers/payment.controller";
import { requiredAuth, validate } from "@akticketorg/commondir";
import { PaymentValidator } from "../validations/payment.validation";
const router = express.Router();
router.post(
  "/create-payment",
  requiredAuth,
  PaymentValidator.createPayment,
  validate,
  PaymentController.createPayment
);
export default router;
