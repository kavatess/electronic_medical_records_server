import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsMongoId, IsOptional } from "class-validator";

export class TransferredDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "isTransfer", type: Boolean })
  readonly isTransfer?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "isOwner", type: Boolean })
  readonly isOwner?: boolean;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "by", type: String })
  readonly by?: string;
}
