import { RequestHandler } from "express";
import { OrderRepository } from "../respositories/order.respositories";

export const OrderController: {
  createOrder: RequestHandler;
  updateOrder: RequestHandler;
  getOrder: RequestHandler;
  getOrders: RequestHandler;
  deleteOrder: RequestHandler;
  getOrderByUser: RequestHandler;
} = {
  async createOrder(req, res, next) {
    try {
      const { ticketId } = req.body;
      console.log(ticketId);
      const userId = req.currentUser!.id;
      console.log(userId, "user");
      const response = await OrderRepository.createOrder(ticketId, userId);
      console.log(response);
      res.json({
        success: true,
        message: "Order created successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateOrder(req, res, next) {
    try {
      const orderId = req.params.orderId;
      const userId = req.currentUser!.id;
      const { status } = req.body;
      const response = await OrderRepository.updateOrder(
        orderId,
        userId,
        status
      );
      res.json({
        success: true,
        message: "Order updated successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  async getOrderByUser(req, res, next) {
    try {
      const userId = req.currentUser!.id;
      const response = await OrderRepository.getOrderByUser(userId);
      res.json({
        success: true,
        message: "Order by user fetch successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  async getOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      const userId = req.currentUser!.id;
      const response = await OrderRepository.getOrder(orderId, userId);
      res.json({
        success: true,
        message: "Order fetch successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  async getOrders(req, res, next) {
    try {
      const userId = req.currentUser!.id;
      const response = await OrderRepository.getOrders(userId);
      res.json({
        success: true,
        message: "Orders fetch successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  async deleteOrder(req, res, next) {
    try {
      const userId = req.currentUser!.id;
      const { orderId } = req.params;
      const response = await OrderRepository.deleteOrder(userId, orderId);
      res.json({
        success: true,
        message: "Order deleted successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
};
