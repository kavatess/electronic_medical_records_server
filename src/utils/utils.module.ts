import { Global, Module } from "@nestjs/common";
import { UserModule } from "src/auth/user/user.module";
import { HtmlService } from "./services/html.service";
import { PhoneService } from "./services/phone.service";
import { SlugifyService } from "./services/slugify.service";
import { ValidationService } from "./services/validation.service";
import { XAuthUserService } from "./services/x-auth-user-validation.service";

@Global()
@Module({
  imports: [UserModule],
  providers: [
    SlugifyService,
    ValidationService,
    XAuthUserService,
    HtmlService,
    PhoneService,
  ],
  exports: [
    SlugifyService,
    ValidationService,
    XAuthUserService,
    HtmlService,
    PhoneService,
  ],
})
export class UtilityModule {}
