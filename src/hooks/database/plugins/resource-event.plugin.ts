import { Schema } from "mongoose";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

class ResourceEventPluginOption {
  exchange?: string;
  readonly resource: string;
  routingKey?: string;
  readonly app: string;
  readonly role?: "master" | "slave";
  readonly populate?: any[];
}

export function resourceEvent(rabbitBaseService: RabbitBaseService) {
  return (schema: Schema, options: ResourceEventPluginOption): any => {
    if (!options.exchange) options.exchange = "ResourceEvent";
    if (!options.routingKey) {
      const key = [];
      key.push(options.app);
      key.push(options.role);
      key.push(options.resource);
      options.routingKey = key.join(".");
    }
    schema.pre("save", function (next) {
      this["wasNew"] = this.isNew;
      next();
    });
    schema.post("save", async function (item) {
      let key = options.routingKey;
      if (item["wasNew"]) key += ".created";
      else key += ".updated";
      if (options.populate)
        item = await item.populate(options.populate).execPopulate();
      rabbitBaseService.publish(options.exchange, key, {
        query: {
          _id: item._id,
        },
        data: item,
      });
    });

    schema.post("remove", function (item) {
      rabbitBaseService.publish(
        options.exchange,
        options.routingKey + ".deleted",
        {
          query: {
            _id: item._id,
          },
          data: item,
        }
      );
    });
  };
}
