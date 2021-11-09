import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../config';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import {
  LocalLoginStrategy,
  LocalRegistrationStrategy
} from './local.strategy';

@Module({
  imports: [
    UsersModule,
    MailModule,
    JwtModule.register({
      secret: envs.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '30s' }
    })
  ],
  providers: [LocalLoginStrategy, LocalRegistrationStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
