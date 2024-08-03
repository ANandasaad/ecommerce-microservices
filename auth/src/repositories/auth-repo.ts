import { BadRequest } from "http-errors";
import Auth from "../models/authModels";
import { BadRequestError } from "../errors/bad-request-errors";

export const AuthRepositories = {
  async SignUp(email: string, password: string) {
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
        return resolve(createUser);
      } catch (error) {
        reject(error);
      }
    });
  },
};
