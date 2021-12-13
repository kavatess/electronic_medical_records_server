import moment from "moment";
import { ObjectId } from "bson";
import { Injectable, MethodNotAllowedException } from "@nestjs/common";
import { RelationshipService } from "src/api/user/relationship/relationship.service";
import { ProviderService } from "src/api/provider/provider.service";
import { ConsultationConversationService } from "src/api/consultation-conversation/consultation-conversation.service";
import { ShortlinkService } from "src/api/user/shortlink/shortlink.service";
import { RelationshipDocument } from "src/api/user/relationship/schemas/relationship.schema";
import { ProviderDocument } from "src/api/provider/schemas/provider.schema";
import { ConversationDocument } from "src/api/consultation-conversation/conversation/schemas/conversation.schema";
import { ShortLink } from "../discriminators/indepth/schemas/shortlink.schema";
import { NORMAL_STATE_FLOW } from "../consultation.constant";
import { Document } from "mongoose";
import { XAuthUserService } from "src/utils/services/x-auth-user-validation.service";
import { BaseServiceOptions } from "src/models/base-service-options.model";
import { ConsultationDto } from "../dto/consultation.dto";

export interface StateBaseServiceOptions extends BaseServiceOptions {
  readonly stateFlow?: StateFlowInfo;
}

export interface StateFlowInfo {
  readonly SCHEDULED?: string[];
  readonly WAITING?: string[];
  readonly INCONSULTATION?: string[];
}

@Injectable()
export abstract class ConsultationHookService<T extends ConsultationDto> {
  constructor(
    protected readonly relationshipService: RelationshipService,
    protected readonly providerService: ProviderService,
    protected readonly xAuthUserService: XAuthUserService,
    protected readonly shortlinkService: ShortlinkService,
    protected readonly conversationService: ConsultationConversationService
  ) {}

  // Validation hooks
  abstract validateIfConsultationExisted(...args: any[]): Promise<any>;

  async validateStateFlow(
    { _id, state }: T & Document,
    newState: string,
    options: StateBaseServiceOptions = {}
  ): Promise<string> {
    if (state === newState) return newState;
    const stateFlow = options.stateFlow || NORMAL_STATE_FLOW;
    if (!stateFlow[state] || !stateFlow[state].includes(newState)) {
      throw new MethodNotAllowedException(
        `${
          options.baseErrMsg || "Error"
        }: Cannot update state of consultation(${_id}) from ${state} to ${newState}`
      );
    }
    return newState;
  }

  async validateUserPatientRelationship(
    { user, patient }: T,
    options: BaseServiceOptions = {}
  ): Promise<RelationshipDocument> {
    if (new ObjectId(user).toString() === new ObjectId(patient).toString())
      return null;
    const userPatientRelationship =
      await this.relationshipService.getUserPatientRelationship(user, patient);
    if (!userPatientRelationship) {
      throw new MethodNotAllowedException(
        `${
          options.baseErrMsg || "Error"
        }: there is no relationship between user(${user}) and patient(${patient})`
      );
    }
    return userPatientRelationship;
  }

  async validateExistedProvider(
    { provider, providerUser }: T,
    options: BaseServiceOptions = {}
  ): Promise<ProviderDocument> {
    const existedProvider = await this.providerService.findOne({
      _id: provider,
      user: providerUser,
    });
    if (!existedProvider) {
      throw new MethodNotAllowedException(
        `${options.baseErrMsg || "Error"}: provider(${provider}) does not exist`
      );
    }
    return existedProvider;
  }

  async validateIfxAuthUserIsProviderOrAdmin(
    { providerUser }: T,
    xAuthUser: string,
    options: BaseServiceOptions = {}
  ): Promise<string> {
    if (
      new ObjectId(xAuthUser).toString() ===
      new ObjectId(providerUser).toString()
    ) {
      return "provider";
    }
    return await this.xAuthUserService.validateIfxAuthUserIsAdmin(
      xAuthUser,
      options
    );
  }

  async validateIfxAuthUserIsPatientOrAdmin(
    { user, patient }: T,
    xAuthUser: string,
    options: BaseServiceOptions = {}
  ): Promise<string> {
    if (
      new ObjectId(xAuthUser).toString() === new ObjectId(user).toString() ||
      new ObjectId(xAuthUser).toString() === new ObjectId(patient).toString()
    ) {
      return "user";
    }
    return await this.xAuthUserService.validateIfxAuthUserIsAdmin(
      xAuthUser,
      options
    );
  }

  // Logical flow hooks
  async createProviderPatientRelationship({
    providerUser,
    user,
    patient,
  }: T): Promise<RelationshipDocument> {
    let providerPatientRelationship =
      await this.relationshipService.createRelationship(
        providerUser,
        user,
        "doctor"
      );
    if (new ObjectId(patient).toString() !== new ObjectId(user).toString()) {
      providerPatientRelationship =
        await this.relationshipService.createRelationship(
          providerUser,
          patient,
          "doctor"
        );
    }
    return providerPatientRelationship;
  }

  async createShortlink(
    consultation: T & Document,
    expiredDate?: Date
  ): Promise<ShortLink> {
    const { _id, user, providerUser } = consultation;
    const expired = expiredDate || moment().add(1, "m").toDate();
    const [provider, patient] = await Promise.all([
      this.shortlinkService.createConsultationShortlink({
        consultation: _id,
        user: providerUser,
        userType: "provider",
        expired,
      }),
      this.shortlinkService.createConsultationShortlink({
        consultation: _id,
        user: user,
        userType: "patient",
        expired,
      }),
    ]);
    consultation.set({
      shortLink: { provider, patient },
    });
    return { provider, patient };
  }

  async createConversation(
    consultation: T & Document
  ): Promise<ConversationDocument> {
    const conversation =
      await this.conversationService.createConversationForConsult(consultation);
    consultation.set({
      conversation: conversation._id,
    });
    return conversation;
  }
}
