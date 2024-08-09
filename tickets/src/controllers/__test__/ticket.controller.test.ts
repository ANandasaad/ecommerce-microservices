import request from "supertest";
import { app } from "../../app";

describe("TicketController", () => {
  describe("POST /api/ticket/create-ticket", () => {
    it("has a route handler listening to the create-ticket", async () => {
      const response = await request(app)
        .post("/api/ticket/create-ticket")
        .send({});

      expect(response.status).not.toEqual(404);
    });
  });
});
