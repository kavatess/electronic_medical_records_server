import { registerAs } from "@nestjs/config";

export default registerAs("openapi", () => ({
  show: process.env.OPENAPI_SHOW === "true",
}));
