import { RequestHandler } from "express";
import { PaymentRepository } from "../repositories/payment.respositories";

export const PaymentController: {
  createPayment: RequestHandler;
} = {
  async createPayment(req, res, next) {
    try {
      const { orderId, token } = req.body;

      const userId = req.currentUser!.id;
      const response = await PaymentRepository.createPayment(
        orderId,
        token,
        userId
      );
      res.json({
        success: true,
        message: "Payment created successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
};
