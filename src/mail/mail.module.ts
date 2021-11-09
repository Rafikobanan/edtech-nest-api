import { MailerModule } from './../mailer/mailer.module';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  imports: [MailerModule],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
