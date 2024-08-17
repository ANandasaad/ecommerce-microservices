import express from "express";
import { OrderController } from "../controllers/order.controller";
import { requiredAuth, validate } from "@akticketorg/commondir";
import { OrderValidator } from "../validations/order.validations";
const router = express.Router();

router.post(
  "/create-order",
  requiredAuth,
  OrderValidator.createOrder,
  validate,
  OrderController.createOrder
);
router.patch("/update-order/:orderId", OrderController.updateOrder);
router.get("/get-orders", OrderController.getOrders);
router.get("/get-order/:orderId", OrderController.getOrder);
router.delete("/delete-order/:orderId", OrderController.deleteOrder);

export default router;
