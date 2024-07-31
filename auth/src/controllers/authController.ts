import { RequestHandler } from "express";
import { AuthRepositories } from "../repositories/auth-repo";

export const AuthController: {
  signUp: RequestHandler;
} = {
  async signUp(req, res, next) {
    try {
      const { email, password } = req.body;
      const response = await AuthRepositories.SignUp(email, password);
      res.send({
        success: true,
        message: "User signed up successfully",
        data: response,
      });
    } catch (error) {
      console.log(error, "error");
      res.status(400).send({
        success: false,
        message: error,
      });
    }
  },
};
