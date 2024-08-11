import { NotAuthorized, NotFoundError } from "@akticketorg/commondir";
import Ticket from "../models/ticketModel";

export const TicketRepo = {
  async createTicket(title: string, price: number, userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const createdTicket = Ticket.build({ title, price, userId });
        await createdTicket.save();
        return resolve(createdTicket);
      } catch (error) {
        reject(error);
      }
    });
  },
  async getTickets() {
    return new Promise(async (resolve, reject) => {
      try {
        const getTicket = await Ticket.find();
        if (!getTicket.length) throw new NotFoundError();
        return resolve(getTicket);
      } catch (error) {
        reject(error);
      }
    });
  },

  async getTicket(ticketId: string, userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const getTicket = await Ticket.findById(ticketId);

        if (!getTicket) throw new NotFoundError();
        if (getTicket.userId !== userId) throw new NotAuthorized();
        return resolve(getTicket);
      } catch (error) {
        reject(error);
      }
    });
  },
};
