import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { FacebookHomeUrlDto } from "./facebook-home-url.dto";

export class FacebookDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "id", type: String })
  readonly id?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FacebookHomeUrlDto)
  @ApiProperty({ name: "home_url", type: FacebookHomeUrlDto })
  readonly home_url?: FacebookHomeUrlDto;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "access_token", type: String })
  readonly access_token?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "persistent_menu", type: String })
  readonly persistent_menu?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ name: "connectChannel", type: Boolean })
  readonly connectChannel?: boolean;
}
