import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import { NotFound } from "http-errors";
import authRoutes from "./routers/auth";
import { errorHandler } from "./middleware/error-handlers";
import { NotFoundError } from "./errors/not-found-errors";
import cookieSession from "cookie-session";
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    secure: true,
    signed: false,
  })
);
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", authRoutes);
app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new NotFound("JWT_KEY is not found");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/Auth");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("listening on port 3000 !!! ");
  });
};

start();
