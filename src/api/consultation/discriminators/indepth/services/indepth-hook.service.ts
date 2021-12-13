import { Injectable, MethodNotAllowedException } from "@nestjs/common";
import { ConsultationConversationService } from "src/api/consultation-conversation/consultation-conversation.service";
import { ProviderService } from "src/api/provider/provider.service";
import { RelationshipService } from "src/api/user/relationship/relationship.service";
import { ShortlinkService } from "src/api/user/shortlink/shortlink.service";
import { BaseServiceOptions } from "src/models/base-service-options.model";
import { XAuthUserService } from "src/utils/services/x-auth-user-validation.service";
import { ConsultationDocument } from "../../../schemas/consultation.schema";
import { ConsultationHookService } from "../../../services/consultation-hook.service";
import { ConsultationService } from "../../../services/consultation.service";
import { CreateIndepthDto } from "../dto/create-indepth.dto";
import { IndepthDto } from "../dto/indepth.dto";

@Injectable()
export class IndepthHookService extends ConsultationHookService<IndepthDto> {
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
    indepth: CreateIndepthDto,
    options: BaseServiceOptions = {}
  ): Promise<ConsultationDocument[]> {
    const existedConsultations =
      await this.consultationService.getExistedConsultations(indepth, {
        type: { $ne: "question" },
      });
    if (existedConsultations.length) {
      throw new MethodNotAllowedException(
        `${options.baseErrMsg}: there are existed consultations ` +
          `between provider(${indepth.provider}) and patient(${indepth.patient})`
      );
    }
    return existedConsultations;
  }
}
