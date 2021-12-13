import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class AddressDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "number", type: String })
  readonly number?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "name", type: String })
  readonly name?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "street1", type: String })
  readonly street1?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "street2", type: String })
  readonly street2?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "street3", type: String })
  readonly street3?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "suburb", type: String })
  readonly suburb?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "state", type: String })
  readonly state?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "postcode", type: String })
  readonly postcode?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "country", type: String })
  readonly country?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "geo", type: String })
  readonly geo?: string;
}
