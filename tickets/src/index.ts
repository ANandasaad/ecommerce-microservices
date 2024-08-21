import mongoose from "mongoose";
import { NotFound } from "http-errors";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new NotFound("JWT_KEY is not found");
  }
  if (!process.env.MONGO_URI) {
    throw new NotFound("MONGO_URI is not found");
  }

  if (!process.env.NATS_URL) {
    throw new NotFound("NATS_URL is not found");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new NotFound("NATS_CLIENT_ID is not found");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new NotFound("NATS_CLUSTER_ID is not found");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log(" listener closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("listening on port 3000 !!! ");
  });
};

start();
