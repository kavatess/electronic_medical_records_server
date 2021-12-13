import { registerAs } from "@nestjs/config";

export default registerAs("auth", () => ({
  secret: process.env.AUTH_SECRET,
  disabled: process.env.AUTH_DISABLED === "true",
}));
