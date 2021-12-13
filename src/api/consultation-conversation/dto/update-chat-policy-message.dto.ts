import { Type } from "class-transformer";
import { IsIn, IsMongoId, IsOptional, ValidateNested } from "class-validator";
import { STATE_ENUM } from "src/api/consultation/consultation.constant";
import { RabbitMessageDto } from "src/hooks/rabbitmq/dto/rabbit-message.dto";

class UpdateChatPolicyInfo {
  @IsMongoId()
  conversation: string;

  @IsIn(STATE_ENUM)
  state: string;
}

export class UpdateChatPolicyMsgDto extends RabbitMessageDto<
  any,
  UpdateChatPolicyInfo
> {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateChatPolicyInfo)
  readonly data?: UpdateChatPolicyInfo;
}
