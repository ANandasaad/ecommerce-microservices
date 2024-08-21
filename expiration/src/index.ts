import { NotFound } from "http-errors";

import { natsWrapper } from "./nats-wrapper";

const start = async () => {
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

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};

start();
