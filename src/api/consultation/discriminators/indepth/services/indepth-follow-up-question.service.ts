import moment from "moment";
import { Injectable, MethodNotAllowedException } from "@nestjs/common";
import { IndepthHookService } from "./indepth-hook.service";
import { Indepth } from "../schemas/indepth.schema";
import { IndepthBaseErrMsg } from "../indepth.constant";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import {
  BASE_ROUTING_KEY,
  MAIN_EXCHANGE,
  MAIN_ROLE,
} from "src/common/constants";
import { CreateFollowUpQuestionDto } from "../dto/create-follow-up-question.dto";
import { IndepthService } from "./indepth.service";

@Injectable()
export class IndepthFollowUpQuestionService {
  constructor(
    private readonly service: IndepthService,
    private readonly hookService: IndepthHookService,
    private readonly rabbitService: RabbitBaseService
  ) {}

  async createFollowUpQuestion(
    indepthId: string,
    followUpQuestion: CreateFollowUpQuestionDto,
    xAuthUser: string
  ): Promise<Indepth> {
    const indepth = await this.service.getDocumentById(indepthId, {
      baseErrMsg: IndepthBaseErrMsg.CREATE_FOLLOW_UP_QUESTION,
    });

    await this.hookService.validateIfxAuthUserIsPatientOrAdmin(
      indepth,
      xAuthUser,
      {
        baseErrMsg: IndepthBaseErrMsg.CREATE_FOLLOW_UP_QUESTION,
      }
    );

    if (!["COMPLETED", "FREE"].includes(indepth.state)) {
      throw new MethodNotAllowedException(
        `${IndepthBaseErrMsg.CREATE_FOLLOW_UP_QUESTION}: Consultation(${indepthId}) is not completed`
      );
    }

    if (moment(indepth.closedAt).add(1, "d") < moment()) {
      throw new MethodNotAllowedException(
        `${IndepthBaseErrMsg.CREATE_FOLLOW_UP_QUESTION}: FollowUpQuestion can only be created within 24h after consultation completed`
      );
    }

    if (indepth.followUpQuestion && indepth.followUpQuestion.question) {
      throw new MethodNotAllowedException(
        `${IndepthBaseErrMsg.CREATE_FOLLOW_UP_QUESTION}: FollowUpQuesion existed`
      );
    }

    indepth.set(followUpQuestion);
    return await indepth.save().then((result) => {
      this.rabbitService.publish(
        MAIN_EXCHANGE,
        `${BASE_ROUTING_KEY}.${MAIN_ROLE}.indepth.followUpQuestion-created`,
        {
          headers: {
            "x-auth-user": xAuthUser,
          },
          data: indepth.toObject(),
        }
      );
      return result;
    });
  }

  async answerFollowUpQuestion(
    indepthId: string,
    answer: string,
    xAuthUser: string
  ): Promise<Indepth> {
    const indepth = await this.service.getDocumentById(indepthId, {
      baseErrMsg: IndepthBaseErrMsg.ANSWER_FOLLOW_UP_QUESTION,
    });

    await this.hookService.validateIfxAuthUserIsProviderOrAdmin(
      indepth,
      xAuthUser,
      {
        baseErrMsg: IndepthBaseErrMsg.ANSWER_FOLLOW_UP_QUESTION,
      }
    );

    const followUpQuestion = indepth.followUpQuestion;
    if (!followUpQuestion || !followUpQuestion.question) {
      throw new MethodNotAllowedException(
        `${IndepthBaseErrMsg.ANSWER_FOLLOW_UP_QUESTION}: FollowUpQuestion not existed`
      );
    }

    if (followUpQuestion.answer) {
      throw new MethodNotAllowedException(
        `${IndepthBaseErrMsg.ANSWER_FOLLOW_UP_QUESTION}: Answer existed`
      );
    }

    if (followUpQuestion.state !== "waiting") {
      throw new MethodNotAllowedException(
        `${IndepthBaseErrMsg.ANSWER_FOLLOW_UP_QUESTION}: Invalid state(${followUpQuestion.state}) of followUpQuestion to answer`
      );
    }

    indepth.set({ answer });
    return await indepth.save().then((result) => {
      this.rabbitService.publish(
        MAIN_EXCHANGE,
        `${BASE_ROUTING_KEY}.${MAIN_ROLE}.indepth.followUpQuestion-replied`,
        {
          headers: {
            "x-auth-user": xAuthUser,
          },
          data: result.toObject(),
        }
      );
      return result;
    });
  }

  async cancelFollowUpQuestion(
    indepthId: string,
    state: string,
    xAuthUser: string
  ): Promise<Indepth> {
    const indepth = await this.service.getDocumentById(indepthId, {
      baseErrMsg: IndepthBaseErrMsg.CANCEL_FOLLOW_UP_QUESTION,
    });

    const followUpQuestion = indepth.followUpQuestion;
    if (!followUpQuestion || !followUpQuestion.question) {
      throw new MethodNotAllowedException(
        `${IndepthBaseErrMsg.CANCEL_FOLLOW_UP_QUESTION}: FollowUpQuestion not existed`
      );
    }

    if (followUpQuestion.answer) {
      throw new MethodNotAllowedException(
        `${IndepthBaseErrMsg.CANCEL_FOLLOW_UP_QUESTION}: Answer existed`
      );
    }

    if (followUpQuestion.state !== "waiting") {
      throw new MethodNotAllowedException(
        `${IndepthBaseErrMsg.CANCEL_FOLLOW_UP_QUESTION}: Invalid state(${followUpQuestion.state}) of followUpQuestion to answer`
      );
    }

    indepth.set({ state });
    return await indepth.save().then((result) => {
      this.rabbitService.publish(
        MAIN_EXCHANGE,
        `${BASE_ROUTING_KEY}.${MAIN_ROLE}.indepth.followUpQuestion-cancelled`,
        {
          headers: {
            "x-auth-user": xAuthUser,
          },
          data: result.toObject(),
        }
      );
      return result;
    });
  }
}
