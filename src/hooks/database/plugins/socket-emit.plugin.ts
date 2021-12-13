import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import flat from "flat";
import { Schema } from "mongoose";

class Populate {
  path: string;
  select?: string;
  populate?: Populate[];
}
class SocketEmitOption {
  onCreated?: boolean;
  onUpdated?: boolean;
  onRemoved?: boolean;
  excluded?: string[];
  included?: string[];
  filter?: Record<string, unknown>;
  responseKey?: string;
  roomKey?: string;
  populate?: Populate[];
  resource: string;
}

export function socketEmit(rabbitBaseService: RabbitBaseService) {
  return (schema: Schema, options: SocketEmitOption): any => {
    options = Object.assign(
      {
        onCreated: true,
        onUpdated: true,
        onRemoved: true,
        excluded: [],
        included: [],
        roomKey: "_id",
      },
      options
    );

    schema.pre("save", function (next) {
      this["wasNew"] = this.isNew;
      next();
    });

    schema.post("save", async function (item) {
      if (options.populate)
        item = await item.populate(options.populate).execPopulate();
      const roomId = flat(item.toObject(), { safe: true })[options.roomKey];
      let data = {};
      if (options.included.length > 0) {
        options.included.forEach((field) => {
          data[field] = item[field];
        });
      } else {
        data = Object.assign(item);
      }
      options.excluded.forEach((field) => {
        delete data[field];
      });
      if (options.responseKey) data = { [options.responseKey]: data };

      options.resource = ("/" + options.resource).replace(/\/\//g, "/");
      if (item["wasNew"] && options.onCreated) {
        rabbitBaseService.sendToQueue("socket-worker", {
          event: "created",
          room: roomId,
          namespace: options.resource,
          data: data,
        });
      } else if (options.onUpdated) {
        rabbitBaseService.sendToQueue("socket-worker", {
          event: "updated",
          room: roomId,
          namespace: options.resource,
          data: data,
        });
      }
    });

    schema.post("remove", async function (item) {
      if (options.populate)
        item = await item.populate(options.populate).execPopulate();
      const removeKey = options.roomKey.split(".")[0];
      const roomId = flat(JSON.parse(JSON.stringify(item)))[removeKey];
      let data = Object.assign(item);
      if (options.responseKey) data = { [options.responseKey]: data };
      if (options.onRemoved) {
        rabbitBaseService.sendToQueue("socket-worker", {
          event: "removed",
          room: roomId,
          namespace: options.resource,
          data: data,
        });
      }
    });
  };
}
