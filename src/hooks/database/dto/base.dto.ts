import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsMongoId, IsDateString } from "class-validator";

export class IBaseDto {
  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    name: "_id",
    type: String,
    example: "5fc4fed5454ae73afcae1c54",
  })
  readonly _id?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    name: "createdBy",
    type: String,
    example: "5fc4fed5454ae73afcae1c54",
  })
  readonly createdBy?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    name: "updatedBy",
    type: String,
    example: "5fc4fed5454ae73afcae1c54",
  })
  readonly updatedBy?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: Date })
  readonly createdAt?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: Date })
  readonly updatedAt?: string;
}
