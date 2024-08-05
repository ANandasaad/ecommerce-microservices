import request from "supertest";
import { app } from "../../app";

describe("AuthController", () => {
  describe("POST /api/users/signUp", () => {
    it("should return 201 on successful signup", async () => {
      const response = await request(app)
        .post("/api/users/signUp")
        .send({
          email: "user@example.com",
          password: "password",
        })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: "User signed up successfully",
        data: expect.any(Object),
      });
    });

    it("should return 400 on invalid email", async () => {
      const response = request(app)
        .post("/api/users/signUp")
        .send({
          email: "user@examplecom",
          password: "password",
        })
        .expect(400);
      expect((await response).body).toEqual({
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: "email",
            message: "must be a valid email address",
          }),
        ]),
      });
    });
    it("should return 400 on invalid password", async () => {
      const response = request(app)
        .post("/api/users/signUp")
        .send({
          email: "user@example.com",
          password: "1",
        })
        .expect(400);
      expect((await response).body).toEqual({
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: "password",
            message: "Invalid value",
          }),
        ]),
      });
    });
  });

  describe("POST /api/users/signIn", () => {
    it("should return 200 on successful sign in", async () => {
      await request(app)
        .post("/api/users/signUp")
        .send({
          email: "user@example.com",
          password: "password",
        })
        .expect(200);

      // Then, sign in the user
      const response = await request(app)
        .post("/api/users/signIn")
        .send({
          email: "user@example.com",
          password: "password",
        })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: "User signIn successfully",
        data: expect.any(Object),
      });
    });
  });
});
