import { Body, Controller, Headers, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateConsultationDto } from "src/api/consultation/dto/create-consultation.dto";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
@ApiTags("admin")
@Controller("/consultation/admin")
export class MessagingController {
  constructor(private readonly rabbitBaseService: RabbitBaseService) {}

  @Post("/exchange/:exchange/topic/:routingKey")
  async pub(
    @Body() body: Record<string, any>,
    @Param() param: Record<string, string>
  ): Promise<any> {
    await this.rabbitBaseService.publish(
      param.exchange,
      param.routingKey,
      body
    );
    return { success: true };
  }

  @Post("/queue/send")
  async sendToQueue(
    @Body() data: CreateConsultationDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<any> {
    await this.rabbitBaseService.sendToQueue("consultation", {
      headers: {
        "x-auth-user": xAuthUser,
      },
      body: {
        data,
      },
    });
    return { success: true };
  }

  @Post("/queue/:name/assert")
  async bind(
    @Body() body: Record<string, any>,
    @Param() param: Record<string, string>
  ): Promise<any> {
    const amqpConnection = this.rabbitBaseService.amqpConnect;
    return await amqpConnection.channel.assertQueue(param.name, body);
  }
}
