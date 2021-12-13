export const HOME_TREATMENT_MEDIUM_ENUM = ["phone", "video", "chat"];
export const CREATE_HOME_TREATMENT_STATE_ENUM = ["SCHEDULED", "WAITING"];
export const HOME_TREATMENT_CANCELLED_ROLE_ENUM = [
  "user",
  "patient",
  "provider",
  "admin",
];
export const UPDATE_HOME_TREATMENT_BY_PATIENT_STATE_ENUM = [
  "WAITING",
  "INCONSULATION",
];
export const HOME_TREATMENT_COMPLETE_STATE_ENUM = ["FREE", "COMPLETED"];
export enum HomeTreatmentBaseErrMsg {
  CREATE = "Error while creating home-treatment consultation",
  UPDATE_HOME_TREATMENT_BY_PATIENT = "Error while patient's updating home-treatment consultation",
  UPDATE_HOME_TREATMENT_BY_PROVIDER = "Error while provider's updating home-treatment consultation",
  REQUEST_FORM = "Error while admin's requesting form",
  FILLOUT_FORM = "Error while patient's filling out form",
  COMPLETE = "Error while completing home-treatment consultation",
  REJECT = "Error while rejecting home-treatment consultation",
  CANCEL = "Error while cancelling home-treatment consultation",
}
