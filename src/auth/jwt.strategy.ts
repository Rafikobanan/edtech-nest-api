import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { envs } from '../config';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.accessToken
      ]),
      secretOrKey: envs.ACCESS_TOKEN_SECRET
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(new ObjectId(payload._id));

    return user;
  }
}
