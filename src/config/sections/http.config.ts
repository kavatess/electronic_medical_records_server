import { registerAs } from "@nestjs/config";

export default registerAs("http", () => ({
  timeout: 3000,
  maxRedirects: 1,
  baseUrl:
    process.env.NODE_ENV === "sandbox"
      ? "https://api.mhealthvn.com"
      : "https://apis.wellcare.vn",
}));
