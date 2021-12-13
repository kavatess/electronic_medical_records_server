import { Type } from "class-transformer";
import { IsMongoId, ValidateNested } from "class-validator";
import { RabbitMessageDto } from "src/hooks/rabbitmq/dto/rabbit-message.dto";

class FavoriteDiagnosisInfo {
  @IsMongoId()
  providerUser: string;

  @IsMongoId({ each: true })
  diagnosis: string[];
}

export class CreateFavoriteDiagnosisMsgDto extends RabbitMessageDto<
  any,
  FavoriteDiagnosisInfo
> {
  @ValidateNested()
  @Type(() => FavoriteDiagnosisInfo)
  readonly data?: FavoriteDiagnosisInfo;
}
