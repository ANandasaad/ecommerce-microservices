import { BadRequest } from "http-errors";
import Auth from "../models/authModels";
import { BadRequestError } from "../errors/bad-request-errors";
import jwt from "jsonwebtoken";
import { Password } from "../service/password";

export interface SignUpRequest extends Request {
  session: {
    jwt?: string;
  };
}
export const AuthRepositories = {
  async SignUp(request: any, email: string, password: string) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!email || typeof email !== "string")
          throw new BadRequest("Provide a valid email");
        if (!password || typeof password !== "string")
          throw new BadRequest("Provide a valid password");
        const isUserExist = await Auth.findOne({ email });
        if (isUserExist) throw new BadRequestError("User already exists");
        const createUser = await Auth.build({ email, password });
        await createUser.save();
        const jwtToken = jwt.sign(
          {
            id: createUser.id,
            email: createUser.email,
          },
          process.env.JWT_KEY!
        );

        request.session = {
          jwt: jwtToken,
        };

        return resolve(createUser);
      } catch (error) {
        reject(error);
      }
    });
  },
  async SignIn(request: any, email: string, password: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const existUser = await Auth.findOne({ email });

        if (!existUser) throw new BadRequestError("Invalid Credentials");
        const passwordMatch = await Password.compare(
          existUser.password,
          password
        );
        if (!passwordMatch) throw new BadRequestError("Invalid Credentials");
        const jwtToken = jwt.sign(
          {
            id: existUser.id,
            email: existUser.email,
          },
          process.env.JWT_KEY!
        );

        request.session = {
          jwt: jwtToken,
        };
        return resolve(existUser);
      } catch (error) {
        reject(error);
      }
    });
  },
  async currentUser(request: any) {
    return new Promise((resolve, reject) => {
      try {
        resolve({ currentUser: request.currentUser });
      } catch (error) {
        reject({ currentUser: null });
      }
    });
  },
};
