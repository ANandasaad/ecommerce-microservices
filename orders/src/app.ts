import express from "express";
import "express-async-errors";

import { currentUser, errorHandler } from "@akticketorg/commondir";
import { NotFoundError } from "@akticketorg/commondir";
import cookieSession from "cookie-session";
import orderRoutes from "./routes/order.routes";
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    secure: process.env.NODE_ENV !== "test",
    signed: false,
  })
);
app.use(currentUser);
app.use(express.urlencoded({ extended: true }));

app.use("/api/orders", orderRoutes);
app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
