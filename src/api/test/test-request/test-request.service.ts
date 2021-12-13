import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConsultationService } from "src/api/consultation/services/consultation.service";
import { ProviderService } from "src/api/provider/provider.service";
import { UserService } from "src/auth/user/user.service";
import { BaseService } from "src/hooks/database/base.service";
import { TestService } from "../test/test.service";
import { CreateTestRequestDto } from "./dto/create-test-request.dto";
import {
  TestRequest,
  TestRequestDocument,
} from "./schemas/test-request.schema";

enum TestRequestBaseErrMsg {
  CREATE = "Error while creating test request",
}

@Injectable()
export class TestRequestService extends BaseService<TestRequestDocument> {
  constructor(
    @InjectModel(TestRequest.name)
    private readonly testRequestModel: Model<TestRequestDocument>,
    private readonly providerService: ProviderService,
    private readonly userService: UserService,
    private readonly consultService: ConsultationService,
    private readonly testService: TestService
  ) {
    super(testRequestModel);
  }

  async createTestRequest(
    testRequest: CreateTestRequestDto,
    xAuthUser: string
  ): Promise<TestRequest> {
    // Validate patient, user and consultation
    await Promise.all([
      this.userService.getDocumentById(testRequest.patient, {
        projections: "_id",
        baseErrMsg: TestRequestBaseErrMsg.CREATE,
      }),
      this.providerService.getDocumentById(testRequest.provider, {
        projections: "_id",
        baseErrMsg: TestRequestBaseErrMsg.CREATE,
      }),
      this.consultService.getDocumentById(testRequest.consultation, {
        projections: "_id",
        baseErrMsg: TestRequestBaseErrMsg.CREATE,
      }),
    ]);

    // Check if test existed
    await Promise.all(
      testRequest.tests.map((test) => {
        return this.testService.getDocumentById(test, {
          baseErrMsg: TestRequestBaseErrMsg.CREATE,
        });
      })
    );

    return await this.create(testRequest, {
      createdBy: xAuthUser,
      updatedBy: xAuthUser,
    });
  }
}
