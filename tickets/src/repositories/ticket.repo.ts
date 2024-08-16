import { NotAuthorized, NotFoundError } from "@akticketorg/commondir";
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
        if (isTicket.userId !== userId) throw new NotAuthorized();
        const updatedTicket = await Ticket.findByIdAndUpdate(
          ticketId,
          {
            title,
            price,
          },
          { new: true }
        );

        new TicketUpdatedPublisher(natsWrapper.client).publish({
          id: updatedTicket.id,
          title: updatedTicket.title,
          price: updatedTicket.price,
          userId: updatedTicket.userId,
        });

        return resolve(updatedTicket);
      } catch (error) {
        reject(error);
      }
    });
  },
};
