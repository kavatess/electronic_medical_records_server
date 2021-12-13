export const TYPE_ENUM = [
  "indepth",
  "simple",
  "virtual",
  "ondemand",
  "quickcall",
  "question",
  "home-treatment",
];
export const MEDIUM_ENUM = ["phone", "video", "chat", "none"];
export const CLOSED_STATES = ["COMPLETED", "FREE", "CANCELLED", "REJECTED"];
export const STATE_ENUM = [
  "SCHEDULED",
  "WAITING",
  "INCONSULTATION",
  ...CLOSED_STATES,
];
export const FOLLOW_UP_QUESTION_TYPE_ENUM = ["illness", "medication"];
export const FOLLOW_UP_QUESTION_STATE_ENUM = [
  "waiting",
  "replied",
  "cancelled",
  "rejected",
];
export const CANCELLED_BY_ROLE_ENUM = ["admin", "provider", "user", "patient"];
export const GET_ALL_API_DEFAULT_FIELDS = [
  "reason",
  "chiefComplaint",
  "state",
  "user",
  "patient",
  "provider",
  "providerUser",
  "questions",
  "medium",
];
export const GET_ALL_QUESTION_API_DEFAULT_FIELDS = [
  "reason",
  "chiefComplaint",
  "type",
  "state",
  "user",
  "patient",
  "provider",
  "providerUser",
  "medium",
  "note",
];
export const NORMAL_STATE_FLOW = {
  SCHEDULED: ["WAITING", "INCONSULTATION", "CANCELLED", "REJECTED"],
  WAITING: ["INCONSULTATION", "CANCELLED", "REJECTED"],
  INCONSULTATION: ["COMPLETED", "FREE"],
};
