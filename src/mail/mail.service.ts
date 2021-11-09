import { Inject, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { envs } from '../config';

@Injectable()
export class MailService {
  constructor(
    @Inject('MAILER') private transporter: Mail<SMTPTransport.SentMessageInfo>
  ) {}

  async sendActivationMail(to: string, link: string) {
    await this.transporter.sendMail({
      from: envs.SMTP_USER,
      to,
      subject: `Account activation on ${envs.API_URL}`,
      text: '',
      html: `
                    <div>
                        <h1>To activate, follow the link</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
    });
  }
}
