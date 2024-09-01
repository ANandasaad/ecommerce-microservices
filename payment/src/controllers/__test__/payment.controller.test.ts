import mongoose from "mongoose";
import Order from "../../models/order.model";
import { OrderStatus } from "@akticketorg/commondir";
import request from "supertest";
import { app } from "../../app";
import { stripe } from "../../stripe";
import Payment from "../../models/payment.model";

jest.mock("../../stripe");

describe("PaymentControlller", () => {
  describe("POST /api/payment/create-payment", () => {
    it("return a 204 with valid inputs", async () => {
      const userId = new mongoose.Types.ObjectId().toHexString();
      const price = Math.floor(Math.random() * 100000);
      const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price,
        status: OrderStatus.Created,
      });

      await order.save();
      (stripe.charges.create as jest.Mock).mockResolvedValue({
        id: "charge_id",
        amount: price * 100,
        currency: "usd",
      });
      (stripe.charges.list as jest.Mock).mockResolvedValue({
        data: [
          {
            id: "charge_id",
            amount: price * 100,
            currency: "usd",
          },
        ],
      });
      await request(app)
        .post("/api/payment/create-payment")
        .set("Cookie", global.signin(userId))
        .send({
          token: "tok_visa",
          orderId: order.id,
        })
        .expect(200);

      // const chargeOptions = (stripe.charges.create as jest.Mock).mock
      //   .calls[0][0];
      // console.log(chargeOptions);
      // expect(chargeOptions.source).toEqual("tok_visa");
      // expect(chargeOptions.amount).toEqual(20);
      // expect(chargeOptions.currency).toEqual("usd");

      const stripeCharges = await stripe.charges.list({ limit: 50 });
      const stripeCharge = stripeCharges.data.find((charge) => {
        return charge.amount === price * 100;
      });
      console.log(stripeCharge);
      expect(stripeCharge).toBeDefined();
      expect(stripeCharge!.currency).toEqual("usd");

      const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id,
      });
      console.log(payment);
      expect(payment).not.toBeNull();
    });
  });
});
