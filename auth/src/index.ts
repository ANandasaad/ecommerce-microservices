import mongoose from "mongoose";
import { NotFound } from "http-errors";
import { app } from "./app";
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
