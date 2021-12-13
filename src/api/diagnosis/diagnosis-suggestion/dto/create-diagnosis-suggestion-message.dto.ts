import { Type } from "class-transformer";
import { IsMongoId, IsOptional, ValidateNested } from "class-validator";
import { RabbitMessageDto } from "src/hooks/rabbitmq/dto/rabbit-message.dto";

class DiagnosisSuggestionInfo {
  @IsMongoId()
  _id: string;

  @IsMongoId()
  patient: string;

  @IsMongoId({ each: true })
  diagnosis: string;

  @IsOptional()
  @IsMongoId()
  updatedBy: string;
}

export class CreateDiagnosisSuggestionMsgDto extends RabbitMessageDto<
  any,
  DiagnosisSuggestionInfo
> {
  @ValidateNested()
  @Type(() => DiagnosisSuggestionInfo)
  readonly data?: DiagnosisSuggestionInfo;
}
