import { RequestHandler } from "express";

export const OrderController: {
  createOrder: RequestHandler;
  updateOrder: RequestHandler;
  getOrder: RequestHandler;
  getOrders: RequestHandler;
  deleteOrder: RequestHandler;
} = {
  async createOrder(req, res, next) {
    try {
    } catch (error) {}
  },

  async updateOrder(req, res, next) {},
  async getOrder(req, res, next) {},
  async getOrders(req, res, next) {},
  async deleteOrder(req, res, next) {},
};
