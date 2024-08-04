import express from "express";
import { AuthValidator } from "../validators/auth-validator";
import { validate } from "../middleware/validation.middleware";
import { AuthController } from "../controllers/authController";
import { currentUser } from "../middleware/current-user.middleware";
import { requiredAuth } from "../middleware/require-auth.middleware";
const router = express.Router();
router.get(
  "/current-user",
  requiredAuth,
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
