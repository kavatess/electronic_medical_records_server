import moment from "moment";
import { ObjectId } from "bson";
import { Injectable } from "@nestjs/common";
import { GenericService } from "src/api/generic/generic.service";
import {
  GetAllQuestionApiResponse,
  QuestionDetail,
} from "../models/get-all-question-api.response.model";
import { QuestionService } from "../discriminators/question/services/question.service";
import { QuestionDocument } from "../discriminators/question/schemas/question.schema";
import { CalendarItem } from "../models/calendar-item.model";

@Injectable()
export class GetAllQuestionService {
  private fields: string[] = [];
  private states: string[] = [];

  constructor(
    private readonly service: QuestionService,
    private readonly genericService: GenericService
  ) {}

  async getAllQuestion(
    fields: string[],
    states: string[]
  ): Promise<GetAllQuestionApiResponse> {
    this.fields = fields;
    this.states = states;
    const resultArr = await Promise.all([
      this.getTodayQuestions(),
      this.getUrgentQuestions(),
      this.getFutureQuestions(),
      this.getDue4To12hQuestions(),
      this.getDue12To20hQuestions(),
      this.getDueGt20hQuestions(),
    ]);
    return new GetAllQuestionApiResponse(...resultArr);
  }

  private async getQuestions(
    questionIdArr: string[]
  ): Promise<QuestionDocument[]> {
    return await this.service.find(
      {
        _id: {
          $in: questionIdArr,
        },
        state: {
          $in: this.states,
        },
      },
      this.fields.join(" "),
      {
        populate: [
          {
            path: "provider",
            select: "title name",
          },
          {
            path: "user",
            select: "name phone gender",
          },
          {
            path: "patient",
            select: "name phone gender",
          },
          {
            path: "providerUser",
            select: "name phone",
          },
        ],
        lean: true,
      }
    );
  }

  private async getQuestionsWithCalendarInfo(
    from: Date,
    to?: Date
  ): Promise<QuestionDetail[]> {
    const queryCond = {
      type: "consultation",
      consultation: {
        $exists: true,
        $ne: null,
      },
      startTime: null,
      endTime: {
        $gte: from,
        $lte: to,
      },
    };
    if (!to) delete queryCond.endTime.$lte;

    const calendarItems = (await this.genericService.search("calendar-item", {
      filter: queryCond,
      fields: ["_id", "endTime", "consultation"],
      sort: "endTime",
    })) as CalendarItem[];

    const questions = await this.getQuestions(
      calendarItems.map((calendar) =>
        new ObjectId(calendar.consultation).toString()
      )
    );
    return questions.map((question) => {
      const endTime = calendarItems.find(
        (item) =>
          new ObjectId(item.consultation).toString() ===
          new ObjectId(question._id).toString()
      ).endTime;
      return {
        provider: question.provider,
        questions: [{ ...question, endTime }],
      };
    });
  }

  private async getTodayQuestions(): Promise<QuestionDetail[]> {
    const from = moment().startOf("d").toDate();
    const to = moment().endOf("d").toDate();
    return await this.getQuestionsWithCalendarInfo(from, to);
  }

  private async getUrgentQuestions(): Promise<QuestionDetail[]> {
    const from = moment().toDate();
    const to = moment().add(8, "h").toDate();
    return await this.getQuestionsWithCalendarInfo(from, to);
  }

  private async getFutureQuestions(): Promise<QuestionDetail[]> {
    const from = moment().endOf("day").toDate();
    return await this.getQuestionsWithCalendarInfo(from);
  }

  private async getDue4To12hQuestions(): Promise<QuestionDetail[]> {
    const from = moment().subtract(12, "h").toDate();
    const to = moment().subtract(4, "h").toDate();
    return await this.getQuestionsWithCalendarInfo(from, to);
  }

  private async getDue12To20hQuestions(): Promise<QuestionDetail[]> {
    const from = moment().subtract(20, "h").toDate();
    const to = moment().subtract(12, "h").toDate();
    return await this.getQuestionsWithCalendarInfo(from, to);
  }

  private async getDueGt20hQuestions(): Promise<QuestionDetail[]> {
    const from = moment().subtract(1, "w").toDate();
    const to = moment().subtract(20, "h").toDate();
    return await this.getQuestionsWithCalendarInfo(from, to);
  }
}
