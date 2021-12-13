import { Injectable, MethodNotAllowedException } from "@nestjs/common";
import { ConsultationConversationService } from "src/api/consultation-conversation/consultation-conversation.service";
import { ProviderService } from "src/api/provider/provider.service";
import { RelationshipService } from "src/api/user/relationship/relationship.service";
import { ShortlinkService } from "src/api/user/shortlink/shortlink.service";
import { BaseServiceOptions } from "src/models/base-service-options.model";
import { XAuthUserService } from "src/utils/services/x-auth-user-validation.service";
import { ConsultationDocument } from "src/api/consultation/schemas/consultation.schema";
import { ConsultationHookService } from "src/api/consultation/services/consultation-hook.service";
import { ConsultationService } from "src/api/consultation/services/consultation.service";
import { HomeTreatmentDto } from "../dto/home-treatment.dto";
import { CreateHomeTreatmentDto } from "../dto/create-home-treatment.dto";

@Injectable()
export class HomeTreatmentHookService extends ConsultationHookService<HomeTreatmentDto> {
  constructor(
    protected readonly relationshipService: RelationshipService,
    protected readonly providerService: ProviderService,
    protected readonly xAuthUserService: XAuthUserService,
    protected readonly shortlinkService: ShortlinkService,
    protected readonly conversationService: ConsultationConversationService,
    private readonly consultationService: ConsultationService
  ) {
    super(
      relationshipService,
      providerService,
      xAuthUserService,
      shortlinkService,
      conversationService
    );
  }

  async validateIfConsultationExisted(
    homeTreatment: CreateHomeTreatmentDto,
    options: BaseServiceOptions = {}
  ): Promise<ConsultationDocument[]> {
    const existedConsultations =
      await this.consultationService.getExistedConsultations(homeTreatment, {
        type: { $ne: "question" },
      });
    if (existedConsultations.length) {
      throw new MethodNotAllowedException(
        `${options.baseErrMsg}: there are existed consultations ` +
          `between provider(${homeTreatment.provider}) and patient(${homeTreatment.patient})`
      );
    }
    return existedConsultations;
  }
}
