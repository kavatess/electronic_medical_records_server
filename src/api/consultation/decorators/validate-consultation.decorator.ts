import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { ValidationService } from "src/utils/services/validation.service";
import { CreateHomeTreatmentDto } from "../discriminators/home-treatment/dto/create-home-treatment.dto";
import { CreateIndepthDto } from "../discriminators/indepth/dto/create-indepth.dto";
import { CreateQuestionDto } from "../discriminators/question/dto/create-question.dto";
import { CreateConsultationDto } from "../dto/create-consultation.dto";

const CONSULT_VALIDATION_DTO = {
  question: CreateQuestionDto,
  "home-treatment": CreateHomeTreatmentDto,
  indepth: CreateIndepthDto,
};

@ValidatorConstraint({ async: true })
export class ValidateConsultationConstraint
  implements ValidatorConstraintInterface
{
  async validate(
    value: CreateConsultationDto,
    _args: ValidationArguments
  ): Promise<boolean> {
    const consultDto =
      CONSULT_VALIDATION_DTO[value.type] || CreateConsultationDto;
    return await new ValidationService()
      .validate(consultDto, value)
      .then(() => true)
      .catch(() => false);
  }
}

export function ValidateConsultation(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateConsultationConstraint,
    });
  };
}
