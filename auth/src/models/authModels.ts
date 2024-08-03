import mongoose from "mongoose";
import { Password } from "../service/password";
interface UserAttrs {
  email: string;
  password: string;
}

interface AuthModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): AuthDoc;
}

interface AuthDoc extends mongoose.Document {
  email: string;
  password: string;
}

const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

authSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

authSchema.statics.build = (attrs: UserAttrs) => {
  return new Auth(attrs);
};

const Auth = mongoose.model<AuthDoc, AuthModel>("Auth", authSchema);

export default Auth;
