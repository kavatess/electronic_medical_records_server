import { CreateHomeTreatmentDto } from "../discriminators/home-treatment/dto/create-home-treatment.dto";
import { HomeTreatment } from "../discriminators/home-treatment/schemas/home-treatment.schema";
import { CreateIndepthDto } from "../discriminators/indepth/dto/create-indepth.dto";
import { Indepth } from "../discriminators/indepth/schemas/indepth.schema";
import { CreateQuestionDto } from "../discriminators/question/dto/create-question.dto";
import { Question } from "../discriminators/question/schemas/question.schema";
import { CreateConsultationDto } from "../dto/create-consultation.dto";
import { Consultation } from "../schemas/consultation.schema";

export type CreateConsultDto =
  | CreateConsultationDto
  | CreateQuestionDto
  | CreateIndepthDto
  | CreateHomeTreatmentDto;

export type Consult = Consultation | Question | Indepth | HomeTreatment;

export interface CreateConsultationService {
  create(consultation: CreateConsultDto, xAuthUser?: string): Promise<Consult>;
}
