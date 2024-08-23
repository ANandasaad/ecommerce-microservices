import express from "express";
import "express-async-errors";
import paymentRoutes from "./routes/payment.routes";
import { currentUser, errorHandler } from "@akticketorg/commondir";
import { NotFoundError } from "@akticketorg/commondir";
import cookieSession from "cookie-session";
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

app.use("/api/payment", paymentRoutes);
app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
