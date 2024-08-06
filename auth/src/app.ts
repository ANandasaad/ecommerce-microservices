import express from "express";
import "express-async-errors";

import authRoutes from "./routers/auth";
import { errorHandler } from "./middleware/error-handlers";
import { NotFoundError } from "./errors/not-found-errors";
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

app.use("/api/users", authRoutes);
app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
