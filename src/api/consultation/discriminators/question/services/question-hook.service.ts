import { Injectable } from "@nestjs/common";
import { ConsultationConversationService } from "src/api/consultation-conversation/consultation-conversation.service";
import { ProviderService } from "src/api/provider/provider.service";
import { RelationshipService } from "src/api/user/relationship/relationship.service";
import { ShortlinkService } from "src/api/user/shortlink/shortlink.service";
import { XAuthUserService } from "src/utils/services/x-auth-user-validation.service";
import { ConsultationHookService } from "../../../services/consultation-hook.service";
import { QuestionDto } from "../dto/question.dto";

@Injectable()
export class QuestionHookService extends ConsultationHookService<QuestionDto> {
  constructor(
    protected readonly relationshipService: RelationshipService,
    protected readonly providerService: ProviderService,
    protected readonly xAuthUserService: XAuthUserService,
    protected readonly shortlinkService: ShortlinkService,
    protected readonly conversationService: ConsultationConversationService
  ) {
    super(
      relationshipService,
      providerService,
      xAuthUserService,
      shortlinkService,
      conversationService
    );
  }

  validateIfConsultationExisted(): Promise<void> {
    return;
  }
}
