import { Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';
import { envs } from '../config';

@Module({
  providers: [
    {
      provide: 'MAILER',
      useFactory: (): Mail<SMTPTransport.SentMessageInfo> => {
        const transporter = nodemailer.createTransport({
          host: envs.SMTP_HOST,
          port: +envs.SMTP_PORT,
          secure: false,
          auth: {
            user: envs.SMTP_USER,
            pass: envs.SMTP_PASSWORD
          }
        });

        return transporter;
      }
    }
  ],
  exports: ['MAILER']
})
export class MailerModule {}
