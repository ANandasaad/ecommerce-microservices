import { RequestHandler } from "express";
import { TicketRepo } from "../repositories/ticket.repo";
import { NotAuthorized } from "@akticketorg/commondir";

export const TicketController: {
  createTicket: RequestHandler;
  getTicket: RequestHandler;
  updateTicket: RequestHandler;
  getTicketById: RequestHandler;
} = {
  async createTicket(req, res, next) {
    try {
      const { Title, Price } = req.body;

      const userId = req.currentUser!.id;

      const response = await TicketRepo.createTicket(Title, Price, userId);
      return res.json({
        success: true,
        message: "Ticket created successfully",
        data: response,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async getTicket(req, res, next) {
    try {
      if (!req.currentUser!.id) throw new NotAuthorized();
      const response = await TicketRepo.getTickets();
      res.json({
        success: true,
        message: "Ticket retrieved successfully",
        data: response,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  async getTicketById(req, res, next) {
    try {
      const { ticketId } = req.params;
      const userId = req.currentUser!.id;
      const response = await TicketRepo.getTicket(ticketId, userId);
      res.json({
        success: true,
        message: "Ticket retrieved successfully",
        data: response,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  async updateTicket(req, res, next) {
    try {
      const { ticketId } = req.params;
      const userId = req.currentUser!.id;
      const { title, price } = req.body;
      const response = await TicketRepo.updateTicket(
        ticketId,
        userId,
        title,
        price
      );
      res.json({
        success: true,
        message: "updated ticket successfully",
        data: response,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
