import { registerAs } from "@nestjs/config";

export default registerAs("cache", () => ({
  ttl: 60 * 60, // seconds
  max: 1000, // maximum number of items in cache
}));
