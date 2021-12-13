import {
  BadRequestException,
  Injectable,
  MethodNotAllowedException,
} from "@nestjs/common";
import { Document } from "mongoose";
import { HomeTreatmentHookService } from "./home-treatment-hook.service";
import { HomeTreatment } from "../schemas/home-treatment.schema";
import { HomeTreatmentBaseErrMsg } from "../home-treatment.constant";
import { RequestFormByAdminDto } from "../dto/request-form-by-admin.dto";
import { CLOSED_STATES } from "src/api/consultation/consultation.constant";
import { FormDocument } from "../schemas/form.schema";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import {
  BASE_ROUTING_KEY,
  MAIN_EXCHANGE,
  MAIN_ROLE,
} from "src/common/constants";
import { AnswerFormByPatientDto } from "../dto/answer-form-by-patient.dto";
import { XAuthUserService } from "src/utils/services/x-auth-user-validation.service";
import { HomeTreatmentService } from "./home-treatment.service";

@Injectable()
export class HomeTreatmentFormService {
  constructor(
    private readonly service: HomeTreatmentService,
    private readonly hookService: HomeTreatmentHookService,
    private readonly xAuthUserService: XAuthUserService,
    private readonly rabbitService: RabbitBaseService
  ) {}

  private async publishFormEvent(
    event: "requested" | "answered",
    consultation: any & Document,
    xAuthUser?: string
  ) {
    return await this.rabbitService.publish(
      MAIN_EXCHANGE,
      `${BASE_ROUTING_KEY}.${MAIN_ROLE}.home-treatment.form-${event}`,
      {
        headers: {
          "x-auth-user": xAuthUser,
        },
        data: consultation.toObject(),
      }
    );
  }

  async requestFormByAdmin(
    homeTreatmentId: string,
    form: RequestFormByAdminDto,
    xAuthUser: string
  ): Promise<HomeTreatment> {
    const homeTreatment = await this.service.getDocumentById(homeTreatmentId, {
      baseErrMsg: HomeTreatmentBaseErrMsg.REQUEST_FORM,
    });

    await this.xAuthUserService.validateIfxAuthUserIsAdmin(xAuthUser, {
      baseErrMsg: HomeTreatmentBaseErrMsg.REQUEST_FORM,
    });

    if (CLOSED_STATES.includes(homeTreatment.state)) {
      throw new MethodNotAllowedException(
        `${HomeTreatmentBaseErrMsg.REQUEST_FORM}: Cannot request form when consultation completed`
      );
    }

    const existedFormIndex = homeTreatment.forms.findIndex(
      (f) => f.id === form.id
    );
    if (existedFormIndex > -1) {
      homeTreatment.forms[existedFormIndex].set(form);
    } else {
      homeTreatment.forms.push(form as FormDocument);
    }

    return await homeTreatment.save().then((result) => {
      this.publishFormEvent("requested", homeTreatment, xAuthUser);
      return result;
    });
  }

  async answerFormByPatient(
    form: AnswerFormByPatientDto,
    xAuthUser: string
  ): Promise<HomeTreatment> {
    const hiddenFields = {};
    form.answers
      .filter((answer) => answer.isHidden)
      .map(({ questionTitle, text }) => {
        hiddenFields[questionTitle] = text;
      });
    if (hiddenFields["consultationId"]) {
      throw new BadRequestException(
        `${HomeTreatmentBaseErrMsg.FILLOUT_FORM}: Missing field consultationId in hiddenFields`
      );
    }
    if (hiddenFields["userId"]) {
      throw new BadRequestException(
        `${HomeTreatmentBaseErrMsg.FILLOUT_FORM}: Missing field userId in hiddenFields`
      );
    }

    const homeTreatment = await this.service.getDocumentById(
      hiddenFields["consultationId"],
      {
        baseErrMsg: HomeTreatmentBaseErrMsg.FILLOUT_FORM,
      }
    );
    await this.hookService.validateIfxAuthUserIsPatientOrAdmin(
      homeTreatment,
      xAuthUser,
      {
        baseErrMsg: HomeTreatmentBaseErrMsg.FILLOUT_FORM,
      }
    );
    if (CLOSED_STATES.includes(homeTreatment.state)) {
      throw new MethodNotAllowedException(
        `${HomeTreatmentBaseErrMsg.FILLOUT_FORM}: Cannot fillout form when consultation completed`
      );
    }

    const existedFormIndex = homeTreatment.forms.findIndex(
      (f) => f.id === form._id
    );
    if (existedFormIndex > -1) {
      const answers = form.answers.filter(
        (answer) => !answer.isCalculator || !answer.isHidden
      );
      const totalScore = answers
        .filter((answer) => answer.hasScore)
        .map((answer) => answer.score)
        .reduce((a, b) => a + b);
      homeTreatment.forms[existedFormIndex].set({
        ...form,
        answers,
        hiddenFields,
        totalScore,
      });
    } else {
      homeTreatment.forms.push(form as FormDocument);
    }

    return await homeTreatment.save().then((result) => {
      this.publishFormEvent("answered", homeTreatment, xAuthUser);
      return result;
    });
  }
}
