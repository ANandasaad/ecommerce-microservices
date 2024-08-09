import express from "express";
import "express-async-errors";
import ticketRoutes from "./routes/ticket-routes";
import { errorHandler } from "@akticketorg/commondir";
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
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", ticketRoutes);
app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
