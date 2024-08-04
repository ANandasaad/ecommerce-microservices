import { NextFunction, Request, Response } from "express";
import { NotAuthorized } from "../errors/not-authorized-errors";

export const requiredAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) throw new NotAuthorized();
  next();
};
