import { Question } from "../discriminators/question/schemas/question.schema";

export class QuestionDetail {
  provider: any;
  questions: QuestionInfo[];
}

export class QuestionInfo extends Question {
  endTime: Date;
}

export class QuestionDescription {
  description: string;
  data: QuestionDetail[];

  constructor(detail: { description: string; questions: QuestionDetail[] }) {
    this.description = detail.description;
    this.data = detail.questions;
  }
}

export class GetAllQuestionApiResponse {
  now: QuestionDetail[];
  today: QuestionDetail[];
  new: QuestionDetail[];
  due12and20: QuestionDescription;
  duegt20: QuestionDescription;
  due4and12: QuestionDescription;

  constructor(
    today: QuestionDetail[],
    urgent: QuestionDetail[],
    future: QuestionDetail[],
    due4To12h: QuestionDetail[],
    due12To20h: QuestionDetail[],
    dueGt20h: QuestionDetail[]
  ) {
    this.today = today;
    this.now = urgent;
    this.new = future;
    this.due4and12 = new QuestionDescription({
      description: "due from 4 hours to 12 hours",
      questions: due4To12h,
    });
    this.due12and20 = new QuestionDescription({
      description: "due from 12 hours to 20 hours",
      questions: due12To20h,
    });
    this.duegt20 = new QuestionDescription({
      description: "due greater than 20 hours",
      questions: dueGt20h,
    });
  }
}
