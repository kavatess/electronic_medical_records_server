import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsArray,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IBaseDto } from 'src/hooks/database/dto/base.dto';
//import_child_dto//
//import_constant//

export class CreateEmployeeDto extends IBaseDto {
//Prop
}
