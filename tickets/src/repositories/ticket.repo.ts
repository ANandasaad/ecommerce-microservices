import {
  BadRequestError,
  NotAuthorized,
  NotFoundError,
} from "@akticketorg/commondir";
import Ticket from "../models/ticketModel";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

export const TicketRepo = {
  async createTicket(title: string, price: number, userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const createdTicket = Ticket.build({ title, price, userId });
        await createdTicket.save();

        new TicketCreatedPublisher(natsWrapper.client).publish({
          id: createdTicket.id,
          title: createdTicket.title,
          price: createdTicket.price,
          userId: createdTicket.userId,
          version: createdTicket.version,
        });
        return resolve(createdTicket);
      } catch (error) {
        reject(error);
      }
    });
  },
  async getTickets() {
    return new Promise(async (resolve, reject) => {
      try {
        const getTicket = await Ticket.find({
          orderId: undefined,
        });
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

  async updateTicket(
    ticketId: string,
    userId: string,
    title: string,
    price: string
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const isTicket = await Ticket.findById(ticketId);

        if (!isTicket) throw new NotFoundError();

        if (isTicket.orderId)
          throw new BadRequestError("cannot edit reserved ticket");
        if (isTicket.userId !== userId) throw new NotAuthorized();

        isTicket.set({ title: title, price: price });

        await isTicket.save();

        new TicketUpdatedPublisher(natsWrapper.client).publish({
          id: isTicket.id,
          title: isTicket.title,
          price: isTicket.price,
          userId: isTicket.userId,
          version: isTicket.version,
        });

        return resolve(isTicket);
      } catch (error) {
        reject(error);
      }
    });
  },
};
