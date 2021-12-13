import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsMongoId } from "class-validator";
import { IsNotEqualProperty } from "src/validators/is-not-equal-property.validator";
import { CreateHomeTreatmentDto } from "./create-home-treatment.dto";

export class HomeTreatmentDto extends CreateHomeTreatmentDto {
  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "provider", type: String })
  readonly provider: string;

  @IsOptional()
  @IsNotEqualProperty("patient")
  @ApiProperty({ name: "providerUser", type: String })
  readonly providerUser: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "user", type: String })
  readonly user: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "patient", type: String })
  readonly patient: string;
}
