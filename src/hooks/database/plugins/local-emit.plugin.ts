import { EventEmitter2 } from "@nestjs/event-emitter";
import { Schema } from "mongoose";
import { PinoLogger } from "nestjs-pino";
import { v1 as uuidv1 } from "uuid";

class Populate {
  path: string;
  select?: string;
  populate?: Populate;
}
class LocalEmitOption {
  onCreated?: boolean = true;
  onUpdated?: boolean = true;
  onRemoved?: boolean = true;
  // filter?: Record<string, unknown>;
  populate?: Populate[];
  resource: string;
}

export function localEmit(
  eventEmitter: EventEmitter2,
  logger: PinoLogger
): any {
  logger.setContext(`LocalEventEmitterPlugin`);
  return (schema: Schema, options: LocalEmitOption) => {
    const defaultOption = { onCreated: true, onUpdated: true, onRemoved: true };
    options = { ...defaultOption, ...options };
    schema.pre("save", function (next) {
      this["wasNew"] = this.isNew;
      next();
    });
    schema.post("save", async function (item) {
      const cid = item["_cid"] || uuidv1();
      const start = Date.now();
      if (options.populate)
        item = await item.populate(options.populate).execPopulate();
      logger.debug({
        msg: `Local event emit from ${options.resource}`,
        cid: cid,
        data: JSON.parse(JSON.stringify(item)),
      });
      if (this["wasNew"] && options.onCreated)
        eventEmitter
          .emitAsync(`${options.resource}.created`, item)
          .then((responses) => {
            logger.trace({
              msg: `Local event: '${options.resource}.created' emitted to ${responses.length} listener(s)`,
              cid: cid,
              responses: responses,
              ms: Date.now() - start,
            });
          })
          .catch((error) => {
            logger.error({
              msg: error.message,
              cid: cid,
              stack: error.stack,
              ms: Date.now() - start,
            });
          });
      if (!this["wasNew"] && options.onUpdated)
        eventEmitter
          .emitAsync(`${options.resource}.updated`, item)
          .then((responses) => {
            logger.trace({
              msg: `Local event '${options.resource}.updated' emitted to ${responses.length} listener(s)`,
              cid: cid,
              responses: responses,
              ms: Date.now() - start,
            });
          })
          .catch((error) => {
            logger.error({
              msg: error.message,
              cid: cid,
              stack: error.stack,
              ms: Date.now() - start,
            });
          });
    });

    schema.post("remove", function (item) {
      const start = Date.now();
      const cid = item["_cid"] || uuidv1();
      if (options.onRemoved)
        eventEmitter
          .emitAsync(`${options.resource}.deleted`, item)
          .then((responses) => {
            logger.trace({
              msg: `Local event '${options.resource}.deleted' emmitted to ${responses.length} listener(s)`,
              cid: cid,
              responses: responses,
              ms: Date.now() - start,
            });
          })
          .catch((error) => {
            logger.error({
              msg: error.message,
              cid: cid,
              stack: error.stack,
              ms: Date.now() - start,
            });
          });
    });
  };
}
