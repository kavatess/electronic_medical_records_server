import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class MediumEnabledDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "chat", type: Boolean })
  readonly chat?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "phone", type: Boolean })
  readonly phone?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "video", type: Boolean })
  readonly video?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "ondemand", type: Boolean })
  readonly ondemand?: string;
}
