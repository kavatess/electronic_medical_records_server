import { registerAs } from "@nestjs/config";

export default registerAs("mongodb", () => ({
  uri: process.env.MONGODB_URI,
  user: process.env.MONGODB_USER,
  password: process.env.MONGODB_PASS,
  authenSource: process.env.MONGODB_AUTHEN_SOURCE,
}));
