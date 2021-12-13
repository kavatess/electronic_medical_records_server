import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { RabbitMessageDto } from "src/hooks/rabbitmq/dto/rabbit-message.dto";
import { ValidateConsultation } from "../decorators/validate-consultation.decorator";
import { CreateConsultDto } from "../models/create-consultation.service.model";

export class CreateConsultationMsgBody {
  @IsOptional()
  @IsNotEmpty()
  readonly list?: string;

  @ValidateConsultation()
  readonly data: CreateConsultDto;
}

export class CreateConsultationMsgDto extends RabbitMessageDto<
  any,
  CreateConsultationMsgBody
> {
  @ValidateNested()
  @Type(() => CreateConsultationMsgBody)
  readonly body: CreateConsultationMsgBody;
}
