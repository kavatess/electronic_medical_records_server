import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  port: process.env.APP_PORT,
  env: process.env.NODE_ENV,
  base: process.env.BASE,
  name: process.env.APP_NAME,
}));
