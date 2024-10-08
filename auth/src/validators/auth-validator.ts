import { body } from "express-validator";

export const AuthValidator = {
  signUpValidator: [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Please enter your email address")
      .isEmail()
      .withMessage("must be a valid email address")
      .bail(),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .notEmpty()
      .withMessage("Please enter your password")
      .isString()
      .withMessage("password must be a string")
      .bail(),
  ],
  signInValidator: [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Please enter your email address")
      .isEmail()
      .withMessage("must be a valid email address")
      .bail(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please enter your password")
      .isString()
      .withMessage("password must be a string")
      .bail(),
  ],
};
