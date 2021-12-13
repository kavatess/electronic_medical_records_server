import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class ArrayUpdateConsultationDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "tags", type: String })
  readonly tags?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ name: "diagnosis", type: String })
  readonly diagnosis?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "altDiagnoses", type: String })
  readonly altDiagnoses?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "questions", type: String })
  readonly questions?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ name: "noteAudio", type: String })
  readonly noteAudio?: string;
}
