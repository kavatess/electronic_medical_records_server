import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsMongoId } from "class-validator";
import { IBaseDto } from "src/hooks/database/dto/base.dto";

export class CreateDiagnosisSuggestionDto extends IBaseDto {
  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    name: "user",
    type: String,
    properties: { refTo: { $ref: "user" } },
  })
  readonly user?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    name: "diagnosis",
    type: String,
    properties: { refTo: { $ref: "diagnosis" } },
  })
  readonly diagnosis?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "consultation", type: String })
  readonly consultation?: string;
}
