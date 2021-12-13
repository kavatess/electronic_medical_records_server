export const QUESTION_MEDIUM_ENUM = ["chat", "none", "audio"];
export const CREATE_QUESTION_STATE_ENUM = ["SCHEDULED", "WAITING"];
export const QUESTION_CANCELLED_ROLE_ENUM = ["provider", "admin"];
export const ANSWER_BY_TEXT_STATE_ENUM = ["WAITING", "INCONSULTATION"];
export enum QuestionBaseErrMsg {
  CREATE = "Error while creating question",
  ANSWER_BY_TEXT = "Error while answering question by text",
  REJECT = "Error while rejecting question",
  COMPLETE = "Error while completing question",
}
