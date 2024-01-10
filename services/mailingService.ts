import {
  CreateEmailTemplateCommand,
  SESv2Client,
  SendEmailCommand,
} from "@aws-sdk/client-sesv2";
import "dotenv/config";
import { templateFormat } from "../typings";
import { resolveRuntimeExtensions } from "@aws-sdk/client-sesv2/dist-types/runtimeExtensions";

export class mailService {
  static client: SESv2Client;
  constructor() {
    if (mailService.client) return;
    mailService.client = new SESv2Client({
      credentials: {
        accessKeyId: process.env.SES_KEY!,
        secretAccessKey: process.env.SES_PASSWORD!,
      },
      region: process.env.AWS_REGION!,
    });
  }

  async sendNotificationEmail({
    websiteEmail,
    templateData,
  }: {
    websiteEmail: string;
    templateData: string;
  }) {
    const input = {
      FromEmailAddress: "brihats34@gmail.com",
      Destination: {
        ToAddresses: [websiteEmail],
      },
      ReplyToAddresses: ["brihats34@gmail.com"],
      Content: {
        Template: {
          TemplateName: "downtime-notification",
          TemplateData: templateData,
        },
      },
    };

    const command = new SendEmailCommand(input);
    const response = await mailService.client.send(command);
    return response;
  }

  async createTemplate({
    templateName,
    templateSubject,
    templateFormat,
  }: {
    templateName: string;
    templateSubject: string;
    templateFormat: templateFormat;
  }) {
    const input = {
      TemplateName: templateName,
      TemplateContent: {
        Subject: templateSubject,
        Text: templateFormat.text,
        Html: templateFormat.html,
      },
    };
    const command = new CreateEmailTemplateCommand(input);
    const response = await mailService.client.send(command);
    return response;
  }
}
