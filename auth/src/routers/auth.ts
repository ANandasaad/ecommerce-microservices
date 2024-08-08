import express from "express";
import { AuthValidator } from "../validators/auth-validator";
import { validate, currentUser } from "@akticketorg/commondir";
import { AuthController } from "../controllers/authController";

const router = express.Router();
router.get(
  "/current-user",

  currentUser,
  AuthController.CurrentUser
);
router.post(
  "/signIn",
  AuthValidator.signInValidator,
  validate,
  AuthController.signIn
);
router.post("/signOut", (req, res) => {
  req.session = null;
  res.send({ message: "You have been signed out" });
});
router.post(
  "/signUp",
  AuthValidator.signUpValidator,
  validate,
  AuthController.signUp
);
export default router;
