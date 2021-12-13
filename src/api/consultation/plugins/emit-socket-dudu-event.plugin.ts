import { Schema } from "mongoose";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { ConsultationDocument } from "../schemas/consultation.schema";

export function emitSocketDuduEvent(rabbitBaseService: RabbitBaseService) {
  return (schema: Schema, _options?: any): any => {
    schema.post("save", function (consultation: ConsultationDocument) {
      const event = consultation["wasNew"]
        ? `${consultation.type}.created`
        : `${consultation.type}.updated`;
      rabbitBaseService.sendToQueue("socket-worker", {
        event,
        room: "dudu",
        namespace: "/Consultation",
        data: consultation,
      });
    });
  };
}
