export class AuditMessage {
  checker: string;
  message: string;
  rule: string;
  valid: boolean;

  constructor(auditInfo: AuditMessage) {
    this.checker = auditInfo.checker;
    this.message = auditInfo.message;
    this.rule = `${auditInfo.checker}.${auditInfo.rule}`;
    this.valid = auditInfo.valid;
  }
}

export class AuditPhoneMessage extends AuditMessage {
  phoneList: string[];
  restrictTo: "provider" | "patient" | "admin";

  constructor(auditInfo: AuditPhoneMessage) {
    super(auditInfo);
    this.phoneList = auditInfo.phoneList;
    this.restrictTo = auditInfo.restrictTo;
  }
}
