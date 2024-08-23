import {
  BadRequestError,
  NotAuthorized,
  NotFoundError,
  OrderStatus,
} from "@akticketorg/commondir";
import Order from "../models/order.model";
import { stripe } from "../stripe";
import Payment from "../models/payment.model";

export const PaymentRepository = {
  async createPayment(orderId: string, token: string, userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          throw new NotFoundError();
        }
        if (order.userId !== userId) {
          throw new NotAuthorized();
        }
        if (order.status === OrderStatus.Cancelled) {
          throw new BadRequestError("Cannot pay for an canceled order");
        }
        const charge = await stripe.charges.create({
          amount: order.price * 100,
          currency: "usd",
          source: token,
        });

        const payment = await Payment.build({
          orderId,
          stripeId: charge.id,
        });
        await payment.save();
        return resolve("payment");
      } catch (error) {
        reject(error);
      }
    });
  },
};
