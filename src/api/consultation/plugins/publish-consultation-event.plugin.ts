import { Schema } from "mongoose";
import { MAIN_EXCHANGE } from "src/common/constants";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { ConsultationDocument } from "../schemas/consultation.schema";

interface PublishEventOptions {
  baseRoutingKey: string;
  role: string;
}

export function publishConsultationEvent(rabbitBaseService: RabbitBaseService) {
  return (schema: Schema, options: PublishEventOptions) => {
    schema.post("save", function (consultation: ConsultationDocument) {
      const routingKeyArr = [];
      const baseRoutingKey = `${options.baseRoutingKey}.${options.role}`;
      const baseRountingKeyByConsultType = `${baseRoutingKey}.${consultation.type}`;
      const normalBaseRoutingKey = `${baseRoutingKey}.Consultation`;

      if (this["wasNew"]) {
        routingKeyArr.push(`${baseRountingKeyByConsultType}.created`);
        routingKeyArr.push(`${normalBaseRoutingKey}.created`);
      } else {
        if (this["wasStateModified"]) {
          const updatedState = consultation.state;
          const originalState = consultation["originalDoc"].state;
          routingKeyArr.push(
            `${baseRountingKeyByConsultType}.${originalState}-${updatedState}`
          );
          routingKeyArr.push(
            `${normalBaseRoutingKey}.${originalState}-${updatedState}`
          );
          routingKeyArr.push(`${baseRountingKeyByConsultType}.${updatedState}`);
          routingKeyArr.push(`${normalBaseRoutingKey}.${updatedState}`);
          routingKeyArr.push(`${baseRountingKeyByConsultType}.state-modified`);
          routingKeyArr.push(`${normalBaseRoutingKey}.state-modified`);
        }

        if (this["wasMediumModified"]) {
          routingKeyArr.push(`${baseRountingKeyByConsultType}.medium-modified`);
          routingKeyArr.push(`${normalBaseRoutingKey}.medium-modified`);
        }

        if (this["wasPatientModified"]) {
          routingKeyArr.push(
            `${baseRountingKeyByConsultType}.patient-modified`
          );
          routingKeyArr.push(`${normalBaseRoutingKey}.patient-modified`);
        }

        routingKeyArr.push(`${baseRountingKeyByConsultType}.updated`);
        routingKeyArr.push(`${normalBaseRoutingKey}.updated`);
      }

      if (this["wasDiagnosisModified"]) {
        routingKeyArr.push(
          `${baseRountingKeyByConsultType}.diagnosis-modified`
        );
        routingKeyArr.push(`${normalBaseRoutingKey}.diagnosis-modified`);
      }

      routingKeyArr.forEach((routingKey) => {
        rabbitBaseService.publish(MAIN_EXCHANGE, routingKey, {
          headers: {
            "x-auth-user": consultation.updatedBy,
          },
          data: consultation,
        });
      });
    });
  };
}
