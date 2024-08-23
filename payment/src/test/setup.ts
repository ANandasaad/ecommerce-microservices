import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";
declare global {
  var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper");

process.env.STRIPE_KEY =
  "sk_test_51PquTbLOBdt7EPlR77y3waIiuC4hckFAfzi5AotSVwcRrKQTfdIU1vxVuRsBQyReSrlm6FIbp0Q7RggP2rhj1r6G00Mqd0hyq4";
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "secret";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db!.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // const email = "test@example.com";
  // const password = "password";

  // const response = await request(app)
  //   .post("/api/users/signUp")
  //   .send({
  //     email,
  //     password,
  //   })
  //   .expect(200);

  // const cookie = response.get("Set-Cookie");
  // if (!cookie) {
  //   throw new Error("Cookie is undefined");
  // }
  // return cookie;

  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@example.com",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64}`];
};
