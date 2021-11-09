import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { envs } from '../config';
import { validate } from 'class-validator';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { plainToClass } from 'class-transformer';
import { UsersModel } from '../users/users.model';

@Injectable()
export class LocalLoginStrategy extends PassportStrategy(
  Strategy,
  'local-login'
) {
  constructor(private usersService: UsersService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const requestUser = plainToClass(LoginUserDto, { email, password });
    const errors = await validate(requestUser);

    if (errors.length > 0) throw new BadRequestException('Invalid data');

    const user = await this.usersService.findByEmail(email);

    if (!user) throw new BadRequestException('Invalid data');

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) throw new BadRequestException('Invalid data');

    if (!user.isEmailVerified)
      throw new BadRequestException('Email is not verified');

    return user;
  }
}

@Injectable()
export class LocalRegistrationStrategy extends PassportStrategy(
  Strategy,
  'local-signup'
) {
  constructor(
    private usersService: UsersService,
    private mailService: MailService
  ) {
    super({
      passReqToCallback: true,
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    const { terms } = req.body;

    if (!terms)
      throw new BadRequestException(
        'You must agree with Terms and Privacy Policy to continue using the platform'
      );

    const requestUser = plainToClass(CreateUserDto, req.body);

    const errors = await validate(requestUser);

    if (errors.length > 0) throw new BadRequestException('Invalid data');

    const candidate = await this.usersService.findByEmail(email);

    if (candidate) throw new BadRequestException('Email is busy');

    const user = new UsersModel();

    user.email = requestUser.email;
    user.name = requestUser.name;
    user.lastName = requestUser.lastName;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user.password = hash;
    user.emailActivationLink = uuidv4() + uuidv4();

    await this.usersService.save(user);

    this.mailService.sendActivationMail(
      email,
      `${envs.API_URL}/api/auth/activate/${user.emailActivationLink}`
    );

    return true;
  }
}
