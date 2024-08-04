import { RequestHandler } from "express";
import { AuthRepositories } from "../repositories/auth-repo";
export const AuthController: {
  signUp: RequestHandler;
  signIn: RequestHandler;
  CurrentUser: RequestHandler;
} = {
  async signUp(req, res, next) {
    try {
      const { email, password } = req.body;
      const response = await AuthRepositories.SignUp(req, email, password);
      res.send({
        success: true,
        message: "User signed up successfully",
        data: response,
      });
    } catch (error) {
      console.log(error, "error");
      next(error);
    }
  },
  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const response = await AuthRepositories.SignIn(req, email, password);
      res.send({
        success: true,
        message: "User signIn successfully",
        data: response,
      });
    } catch (error) {
      console.log(error, "error");
      next(error);
    }
  },
  async CurrentUser(req, res, next) {
    try {
      const response = await AuthRepositories.currentUser(req);
      res.send({
        success: true,
        message: "Current user fetched",
        data: response,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
