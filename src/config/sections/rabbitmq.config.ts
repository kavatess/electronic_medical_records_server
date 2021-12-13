import { ConnectionInitOptions } from "@golevelup/nestjs-rabbitmq";
import { registerAs } from "@nestjs/config";

export default registerAs("rabbitmq", () => ({
  uri: process.env.RABBITMQ_URI,
  connectionInitOptions: {
    wait: true,
    timeout: process.env.RABBITMQ_TIMEOUT || 30000,
    reject: true,
  } as ConnectionInitOptions,
}));
