import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNumber, IsOptional, Max } from "class-validator";

export class DefaultDto {
  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "corpus", type: String })
  readonly corpus?: string;

  @IsOptional()
  @IsNumber()
  @Max(3600)
  @ApiProperty({ name: "waitToRespond", type: Number })
  readonly waitToRespond?: number;

  @IsOptional()
  @IsNumber()
  @Max(4320)
  @ApiProperty({ name: "chatSessionTimeout", type: Number })
  readonly chatSessionTimeout?: number;
}
