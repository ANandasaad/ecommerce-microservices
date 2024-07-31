import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { UnprocessableEntity } from "http-errors";
import { RequestValidationError } from "../errors/request-validation-errors";
export const validate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new RequestValidationError(errors.array());
    next();
  } catch (error) {
    next(error);
  }
};
