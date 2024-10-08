import {
  BadRequestError,
  NotAuthorized,
  NotFoundError,
  OrderStatus,
} from "@akticketorg/commondir";
import Ticket from "../models/ticket.model";
import Order from "../models/order.model";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
const EXPIRE_TIME = 15 * 60;
export const OrderRepository = {
  async createOrder(ticketId: string, userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) throw new NotFoundError();

        // const isReserved = await Ticket.isReserved();

        // if (isReserved) throw new BadRequestError("Order already exists");
        const existingOrder = await Order.findOne({
          ticket: ticket._id,
          status: {
            $in: [
              OrderStatus.Created,
              OrderStatus.AwaitingPayment,
              OrderStatus.Complete,
            ],
          },
        });

        if (existingOrder) throw new BadRequestError("Order already exists");
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRE_TIME);

        const order = await Order.build({
          userId: userId,
          status: OrderStatus.Created,
          expiresAt: expiration,
          ticket: ticket,
        });

        await order.save();

        new OrderCreatedPublisher(natsWrapper.client).publish({
          id: order.id,
          status: order.status,
          userId: order.userId,
          expiresAt: order.expiresAt.toISOString(),
          version: order.version,
          ticket: {
            id: ticket.id,
            price: ticket.price,
          },
        });
        return resolve(order);
      } catch (error) {
        reject(error);
      }
    });
  },
  async getOrderByUser(userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const orders = await Order.find({
          userId: userId,
        }).populate("ticket");
        return resolve(orders);
      } catch (error) {
        reject(error);
      }
    });
  },
  async updateOrder(orderId: string, userId: string, status: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.findById(orderId).populate("ticket");
        if (!order) throw new NotFoundError();

        order.status = OrderStatus.Cancelled;
        await order.save();

        new OrderCancelledPublisher(natsWrapper.client).publish({
          id: order.id,
          version: order.version,
          ticket: {
            id: order.ticket.id,
            price: order.ticket.price,
          },
        });
        return resolve(order);
      } catch (error) {
        reject(error);
      }
    });
  },
  async deleteOrder(userId: string, orderId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.findById(orderId);
        if (!order) throw new NotFoundError();
        if (order.userId !== userId) throw new NotAuthorized();
        const deleteOrder = await Order.findByIdAndDelete(orderId);
        return resolve(deleteOrder);
      } catch (error) {
        resolve(error);
      }
    });
  },
  async getOrder(orderId: string, userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.findById(orderId).populate("ticket");
        if (!order) throw new NotFoundError();
        if (order.userId !== userId) throw new NotAuthorized();
        return resolve(order);
      } catch (error) {
        reject(error);
      }
    });
  },
  async getOrders(userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const orders = await Order.find().populate("ticket");
        if (!orders.length) throw new NotFoundError();
        return resolve(orders);
      } catch (error) {
        reject(error);
      }
    });
  },
};
