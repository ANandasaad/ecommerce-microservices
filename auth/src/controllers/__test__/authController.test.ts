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

    it("disallows duplicate emails", async () => {
      await request(app)
        .post("/api/users/signUp")
        .send({
          email: "user@example.com",
          password: "password",
        })
        .expect(200);
      await request(app)
        .post("/api/users/signUp")
        .send({
          email: "user@example.com",
          password: "password",
        })
        .expect(400);
    });
    it("sets a cookie after successful signup", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send({
          email: "test@test.com",
          password: "password",
        })
        .expect(200);

      expect(response.get("Set-Cookie")).toBeDefined();
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

      await request(app)
        .post("/api/users/signIn")
        .send({
          email: "user@example.example",
          password: "pas",
        })
        .expect(400);
    });

    it("should return an error when is invalid password", async () => {
      await request(app)
        .post("/api/users/signUp")
        .send({
          email: "user@example.com",
          password: "password",
        })
        .expect(200);
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

      await request(app)
        .post("/api/users/signIn")
        .send({
          email: "user@example.com",
          password: "pass",
        })
        .expect(400);
    });
  });

  describe("POST /api/users/signOut", () => {
    it("clears the cookie after signing out", async () => {
      await request(app)
        .post("/api/users/signUp")
        .send({
          email: "user@example.com",
          password: "password",
        })
        .expect(200);

      const response = await request(app)
        .post("/api/users/signOut")
        .send({})
        .expect(200);
      expect(response.get("Set-Cookie")?.[0]).toEqual(
        "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
      );
    });
  });

  describe("GET /api/users/current-user", () => {
    it("returns the current user", async () => {
      await request(app)
        .post("/api/users/signUp")
        .send({
          email: "user@example.com",
          password: "password",
        })
        .expect(200);

      const response = await request(app)
        .get("/api/users/current-user")
        .send()
        .expect(400);
    });

    it("returns 400 with error body when no session cookie is provided", async () => {
      const response = await request(app)
        .get("/api/users/current-user")
        .send()
        .expect(400);

      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "invalid credentials user is not logged in",
          }),
        ])
      );
    });

    it("returns 200 with current user data when authenticated via session cookie", async () => {
      const signUpResponse = await request(app)
        .post("/api/users/signUp")
        .send({
          email: "authuser@example.com",
          password: "password",
        })
        .expect(200);

      const cookie = signUpResponse.get("Set-Cookie");
      expect(cookie).toBeDefined();

      const response = await request(app)
        .get("/api/users/current-user")
        .set("Cookie", cookie!)
        .send()
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: "Current user fetched",
        data: expect.objectContaining({
          currentUser: expect.objectContaining({
            email: "authuser@example.com",
          }),
        }),
      });
    });

    it("returns 400 when session cookie contains a malformed JWT", async () => {
      const malformedSession = Buffer.from(
        JSON.stringify({ jwt: "not.a.valid.jwt.token" })
      ).toString("base64");

      const response = await request(app)
        .get("/api/users/current-user")
        .set("Cookie", `session=${malformedSession}`)
        .send()
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("returns 400 (not 401) for unauthenticated access confirming error type", async () => {
      const response = await request(app)
        .get("/api/users/current-user")
        .send();

      expect(response.status).toBe(400);
      expect(response.status).not.toBe(401);
    });
  });
});
