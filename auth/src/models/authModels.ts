import mongoose from "mongoose";
interface UserAttrs {
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

const Auth = mongoose.model("Auth", authSchema);
const buildUser = (attrs: UserAttrs) => {
  return new Auth(attrs);
};
export default Auth;
