export const INDEPTH_MEDIUM_ENUM = ["phone", "video", "chat"];
export const CREATE_INDEPTH_STATE_ENUM = ["SCHEDULED", "WAITING"];
export const INDEPTH_CANCELLED_ROLE_ENUM = [
  "user",
  "patient",
  "provider",
  "admin",
];
export const UPDATE_INDEPTH_BY_PATIENT_STATE_ENUM = [
  "WAITING",
  "INCONSULATION",
];
export const INDEPTH_FOLLOW_UP_QUESTION_TYPE_ENUM = ["medication", "illness"];
export const INDEPTH_FOLLOW_UP_QUESTION_STATE_ENUM = [
  "waiting",
  "replied",
  "cancelled",
  "rejected",
];
export enum IndepthBaseErrMsg {
  CREATE = "Error while creating indepth",
  UPDATE_INDEPTH_BY_PATIENT = "Error while patient's updating indepth",
  UPDATE_INDEPTH_BY_PROVIDER = "Error while provider's updating indepth",
  REQUEST_FORM = "Error while admin's requesting form",
  FILLOUT_FORM = "Error while patient's filling out form",
  COMPLETE = "Error while completing indepth",
  REJECT = "Error while rejecting indepth",
  CANCEL = "Error while cancelling indepth",
  CREATE_FOLLOW_UP_QUESTION = "Error while creating followUpQuestion",
  ANSWER_FOLLOW_UP_QUESTION = "Error while answering followUpQuestion",
  CANCEL_FOLLOW_UP_QUESTION = "Error while cancelling followUpQuestion",
}
