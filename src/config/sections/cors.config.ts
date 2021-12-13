import { registerAs } from "@nestjs/config";

export default registerAs("cors", () => ({
  origin: "*",
  methods: "GET,HEAD,PUT,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));
