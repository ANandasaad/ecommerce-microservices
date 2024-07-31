import { BadRequest } from "http-errors";

export const AuthRepositories = {
  async SignUp(email: string, password: string) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!email || typeof email !== "string")
          throw new BadRequest("Provide a valid email");
        if (!password || typeof password !== "string")
          throw new BadRequest("Provide a valid password");
      } catch (error) {
        reject(error);
      }
    });
  },
};
