import { Injectable } from "@nestjs/common";
import { HtmlService } from "src/utils/services/html.service";
import { PhoneService } from "src/utils/services/phone.service";
import { AuditMessage, AuditPhoneMessage } from "../models/audit-message.model";
import { ConsultationDocument } from "../schemas/consultation.schema";
import { ConsultationService } from "./consultation.service";

@Injectable()
export class AuditService {
  constructor(
    private readonly service: ConsultationService,
    private readonly phoneService: PhoneService,
    private readonly htmlService: HtmlService
  ) {}

  async auditConsultation(consultId: string): Promise<AuditMessage[]> {
    const consultation = await this.service.getDocumentById(consultId);
    return this.checkIfProviderOrPatientShowPhoneNumber(consultation);
  }

  private checkIfProviderOrPatientShowPhoneNumber({
    type,
    chiefComplaint,
    questions,
    note,
    followUpQuestion,
  }: ConsultationDocument): AuditMessage[] {
    const auditRule = "phone-in-text";
    const auditMessage: AuditMessage[] = [];

    if (chiefComplaint) {
      const phoneList = this.phoneService.findPhoneInText(chiefComplaint);
      auditMessage.push(
        new AuditPhoneMessage({
          checker: `${type}.chiefComplaint`,
          message: "chiefComplaint contains phone number",
          rule: auditRule,
          valid: !!phoneList.length,
          phoneList,
          restrictTo: "provider",
        })
      );
    }

    if (questions.length) {
      let phoneList = [];
      questions.forEach((question) => {
        phoneList = phoneList.concat(
          this.phoneService.findPhoneInText(question)
        );
      });
      auditMessage.push(
        new AuditPhoneMessage({
          checker: `${type}.questions`,
          message: "questions contains phone number",
          rule: auditRule,
          valid: !!phoneList.length,
          phoneList,
          restrictTo: "provider",
        })
      );
    }

    if (note) {
      const processedNote = this.htmlService.removeHTMLTags(note);
      const phoneList = this.phoneService.findPhoneInText(processedNote);
      auditMessage.push(
        new AuditPhoneMessage({
          checker: `${type}.note`,
          message: "note contains phone number",
          rule: auditRule,
          valid: !!phoneList.length,
          phoneList,
          restrictTo: "patient",
        })
      );
    }

    if (followUpQuestion) {
      ["question", "answer"].forEach((field) => {
        if (followUpQuestion[field]) {
          const phoneList = this.phoneService.findPhoneInText(
            followUpQuestion[field]
          );
          auditMessage.push(
            new AuditPhoneMessage({
              checker: `${type}.followUpQuestion`,
              message: `${field} of followUpQuestion contains phone number`,
              rule: auditRule,
              valid: !!phoneList.length,
              phoneList,
              restrictTo: "patient",
            })
          );
        }
      });
    }

    return auditMessage;
  }
}
