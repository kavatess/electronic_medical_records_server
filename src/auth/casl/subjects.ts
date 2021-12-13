import { UserRole } from "src/auth/user-role/schemas/user-role.schema";
import { User } from "src/auth/user/schemas/user.schema";
import { BasicConsultation } from "src/api/consultation/schemas/consultation.schema";
import { Conversation } from "src/api/consultation-conversation/conversation/schemas/conversation.schema";
import { Channel } from "src/api/consultation-conversation/channel/schemas/channel.schema";
import { ConversationUser } from "../../api/consultation-conversation/conversation-user/schemas/conversation-user.schema";
import { Diagnosis } from "../../api/diagnosis/diagnosis/schemas/diagnosis.schema";
import { DiagnosisSuggestion } from "../../api/diagnosis/diagnosis-suggestion/schemas/diagnosis-suggestion.schema";
import { Favorite } from "src/api/diagnosis/favorite/schemas/favorite.schema";
import { Drug } from "../../api/prescription/modules/drug/schemas/drug.schema";
import { MedicalReference } from "../../api/medical-reference/schemas/medical-reference.schema";
import { Observation } from "../../api/observation/observation/schemas/observation.schema";
import { Prescription } from "src/api/prescription/schemas/prescription.schema";
import { PrescriptionAutoFill } from "../../api/prescription/modules/prescription-auto-fill/schemas/prescription-auto-fill.schema";
import { Provider } from "../../api/provider/schemas/provider.schema";
import { Test } from "src/api/test/test/schemas/test.schema";
import { TestRequest } from "src/api/test/test-request/schemas/test-request.schema";
import { TestResult } from "src/api/test/test-result/schemas/test-result.schema";
import { PatientNote } from "src/api/observation/patient-note/schemas/patient-note.schema";
import { Relationship } from "src/api/user/relationship/schemas/relationship.schema";

export type Subjects =
  | typeof User
  | User
  | typeof UserRole
  | UserRole
  | typeof BasicConsultation
  | BasicConsultation
  | typeof Channel
  | Channel
  | typeof Conversation
  | Conversation
  | typeof ConversationUser
  | ConversationUser
  | typeof Diagnosis
  | Diagnosis
  | typeof DiagnosisSuggestion
  | DiagnosisSuggestion
  | typeof Favorite
  | Favorite
  | typeof Drug
  | Drug
  | typeof Test
  | Test
  | typeof MedicalReference
  | MedicalReference
  | typeof Observation
  | Observation
  | typeof Prescription
  | Prescription
  | typeof PrescriptionAutoFill
  | PrescriptionAutoFill
  | typeof Provider
  | Provider
  | typeof TestRequest
  | TestRequest
  | typeof TestResult
  | TestResult
  | typeof PatientNote
  | PatientNote
  | typeof Relationship
  | Relationship
  | "all";
