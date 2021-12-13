import { applyDecorators } from "@nestjs/common";
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiMovedPermanentlyResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiNotImplementedResponse,
  ApiPayloadTooLargeResponse,
  ApiPreconditionFailedResponse,
  ApiRequestTimeoutResponse,
  ApiResponseOptions,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiUnsupportedMediaTypeResponse,
} from "@nestjs/swagger";

function getExampleRes(code: string, message: string): ApiResponseOptions {
  return {
    schema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          example: code,
        },
        message: {
          type: "string",
          example: message,
        },
      },
    },
  };
}

export function ApiErrorResponses(errorCodes: string[]): any {
  const decorators: MethodDecorator[] = [];
  errorCodes.forEach((errorCode) => {
    switch (errorCode.substring(0, 3)) {
      case "301":
        decorators.push(
          ApiMovedPermanentlyResponse(
            getExampleRes(errorCode, "Moved Permanently")
          )
        );
        break;
      case "400":
        decorators.push(
          ApiBadRequestResponse(getExampleRes(errorCode, "Bad Request"))
        );
        break;
      case "401":
        decorators.push(
          ApiUnauthorizedResponse(getExampleRes(errorCode, "Unauthorized"))
        );
        break;
      case "403":
        decorators.push(
          ApiForbiddenResponse(getExampleRes(errorCode, "Forbidden Resource"))
        );
        break;
      case "404":
        decorators.push(
          ApiNotFoundResponse(getExampleRes(errorCode, "Not Found"))
        );
        break;
      case "405":
        decorators.push(
          ApiMethodNotAllowedResponse(
            getExampleRes(errorCode, "Method Not Allowed")
          )
        );
        break;
      case "406":
        decorators.push(
          ApiNotAcceptableResponse(getExampleRes(errorCode, "Not Acceptable"))
        );
        break;
      case "408":
        decorators.push(
          ApiRequestTimeoutResponse(getExampleRes(errorCode, "Request Timeout"))
        );
        break;
      case "409":
        decorators.push(
          ApiConflictResponse(getExampleRes(errorCode, "Conflict"))
        );
        break;
      case "412":
        decorators.push(
          ApiPreconditionFailedResponse(
            getExampleRes(errorCode, "Precondition Failed")
          )
        );
        break;
      case "413":
        decorators.push(
          ApiPayloadTooLargeResponse(
            getExampleRes(errorCode, "Payload Too Large")
          )
        );
        break;
      case "415":
        decorators.push(
          ApiUnsupportedMediaTypeResponse(
            getExampleRes(errorCode, "Unsupported Media Type")
          )
        );
        break;
      case "422":
        decorators.push(
          ApiUnprocessableEntityResponse(
            getExampleRes(errorCode, "Unprocessable Entity")
          )
        );
        break;
      case "429":
        decorators.push(
          ApiTooManyRequestsResponse(
            getExampleRes(errorCode, "Too Many Request")
          )
        );
        break;
      case "500":
        decorators.push(
          ApiInternalServerErrorResponse(
            getExampleRes(errorCode, "Internal Server Error")
          )
        );
        break;
      case "501":
        decorators.push(
          ApiNotImplementedResponse(getExampleRes(errorCode, "Not Implemented"))
        );
        break;
      case "502":
        decorators.push(
          ApiBadGatewayResponse(getExampleRes(errorCode, "Bad Gateway"))
        );
        break;
      default:
        decorators.push(
          ApiBadRequestResponse(getExampleRes(errorCode, "Bad Request"))
        );
    }
  });
  return applyDecorators(...decorators);
}
