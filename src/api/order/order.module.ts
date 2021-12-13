import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { localEmit } from "src/hooks/database/plugins/local-emit.plugin";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { LoggerModule, PinoLogger } from "nestjs-pino";
import { OrderItem, OrderItemSchema } from "./schemas/order-item.schema";
import { Order, OrderSchema } from "./schemas/order.schema";

export const PLATFORM_ENUM = ["facebook", "onemr", "zalo"];
export const WEBVIEW_HEIGHT_RATIO_ENUM = ["tall"];
export const WEBVIEW_SHARE_BUTTON_ENUM = ["show", "hide"];

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: OrderItem.name,
        imports: [EventEmitterModule, LoggerModule],
        useFactory: function (eventEmitter: EventEmitter2, logger: PinoLogger) {
          const schema = OrderItemSchema;
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "OrderItem",
            populate: [],
          });
          return schema;
        },
        inject: [EventEmitter2, PinoLogger],
      },
      {
        name: Order.name,
        imports: [EventEmitterModule, LoggerModule],
        useFactory: function (eventEmitter: EventEmitter2, logger: PinoLogger) {
          const schema = OrderSchema;
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "Order",
            populate: [],
          });
          return schema;
        },
        inject: [EventEmitter2, PinoLogger],
      },
    ]),
  ],
})
export class OrderModule {}
