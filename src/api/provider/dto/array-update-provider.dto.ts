import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class ArrayUpdateProviderDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "spoken", type: String })
  readonly spoken?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "specialty", type: String })
  readonly specialty?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "location", type: String })
  readonly location?: string;
}
