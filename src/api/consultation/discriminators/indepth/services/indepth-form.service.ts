import {
  BadRequestException,
  Injectable,
  MethodNotAllowedException,
} from "@nestjs/common";
import { Document } from "mongoose";
import { IndepthHookService } from "./indepth-hook.service";
import { Indepth } from "../schemas/indepth.schema";
import { IndepthBaseErrMsg } from "../indepth.constant";
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
import { IndepthService } from "./indepth.service";

@Injectable()
export class IndepthFormService {
  constructor(
    private readonly service: IndepthService,
    private readonly hookService: IndepthHookService,
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
      `${BASE_ROUTING_KEY}.${MAIN_ROLE}.indepth.form-${event}`,
      {
        headers: {
          "x-auth-user": xAuthUser,
        },
        data: consultation.toObject(),
      }
    );
  }

  async requestFormByAdmin(
    indepthId: string,
    form: RequestFormByAdminDto,
    xAuthUser: string
  ): Promise<Indepth> {
    const indepth = await this.service.getDocumentById(indepthId, {
      baseErrMsg: IndepthBaseErrMsg.REQUEST_FORM,
    });

    await this.xAuthUserService.validateIfxAuthUserIsAdmin(xAuthUser, {
      baseErrMsg: IndepthBaseErrMsg.REQUEST_FORM,
    });

    if (CLOSED_STATES.includes(indepth.state)) {
      throw new MethodNotAllowedException(
        `${IndepthBaseErrMsg.REQUEST_FORM}: Cannot request form when consultation completed`
      );
    }

    const existedFormIndex = indepth.forms.findIndex((f) => f.id === form.id);
    if (existedFormIndex > -1) {
      indepth.forms[existedFormIndex].set(form);
    } else {
      indepth.forms.push(form as FormDocument);
    }

    return await indepth.save().then((result) => {
      this.publishFormEvent("requested", indepth, xAuthUser);
      return result;
    });
  }

  async answerFormByPatient(
    form: AnswerFormByPatientDto,
    xAuthUser: string
  ): Promise<Indepth> {
    const hiddenFields = {};
    form.answers
      .filter((answer) => answer.isHidden)
      .map(({ questionTitle, text }) => {
        hiddenFields[questionTitle] = text;
      });
    if (hiddenFields["consultationId"]) {
      throw new BadRequestException(
        `${IndepthBaseErrMsg.FILLOUT_FORM}: Missing field consultationId in hiddenFields`
      );
    }
    if (hiddenFields["userId"]) {
      throw new BadRequestException(
        `${IndepthBaseErrMsg.FILLOUT_FORM}: Missing field userId in hiddenFields`
      );
    }

    const indepth = await this.service.getDocumentById(
      hiddenFields["consultationId"],
      {
        baseErrMsg: IndepthBaseErrMsg.FILLOUT_FORM,
      }
    );
    await this.hookService.validateIfxAuthUserIsPatientOrAdmin(
      indepth,
      xAuthUser,
      {
        baseErrMsg: IndepthBaseErrMsg.FILLOUT_FORM,
      }
    );
    if (CLOSED_STATES.includes(indepth.state)) {
      throw new MethodNotAllowedException(
        `${IndepthBaseErrMsg.FILLOUT_FORM}: Cannot fillout form when consultation completed`
      );
    }

    const existedFormIndex = indepth.forms.findIndex((f) => f.id === form._id);
    if (existedFormIndex > -1) {
      const answers = form.answers.filter(
        (answer) => !answer.isCalculator || !answer.isHidden
      );
      const totalScore = answers
        .filter((answer) => answer.hasScore)
        .map((answer) => answer.score)
        .reduce((a, b) => a + b);
      indepth.forms[existedFormIndex].set({
        ...form,
        answers,
        hiddenFields,
        totalScore,
      });
    } else {
      indepth.forms.push(form as FormDocument);
    }

    return await indepth.save().then((result) => {
      this.publishFormEvent("answered", indepth, xAuthUser);
      return result;
    });
  }
}
