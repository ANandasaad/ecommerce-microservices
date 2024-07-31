import express from "express";
import { AuthValidator } from "../validators/auth-validator";
import { validate } from "../middleware/validation.middleware";
import { AuthController } from "../controllers/authController";
const router = express.Router();
router.get("/current-user", (req, res) => {
  res.send({
    message: "Please enter",
  });
});
router.post("/signIn", (req, res) => {
  res.send({
    message: "You have been signed in",
  });
});
router.post("/signOut", (req, res) => {
  res.send({ message: "You have been signed out" });
});
router.post(
  "/signUp",
  AuthValidator.signUpValidator,
  validate,
  AuthController.signUp
);
export default router;
