import { RequestHandler } from "express";
import { TicketRepo } from "../repositories/ticket.repo";

export const TicketController: { createTicket: RequestHandler } = {
  async createTicket(req, res, next) {
    try {
      const { Title, Price } = req.body;
      const response = await TicketRepo.createTicket(Title, Price);
      res.json({
        success: true,
        message: "Ticket created successfully",
        data: response,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
