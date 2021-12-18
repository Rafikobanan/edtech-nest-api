import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { envs } from '../config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ObjectId } from 'mongodb';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async loginById(_id: ObjectId) {
    const payload: JwtPayload = { _id: _id.toString() };

    const accessToken = jwt.sign(payload, envs.ACCESS_TOKEN_SECRET, {
      expiresIn: '30s'
    });

    const refreshToken = jwt.sign(payload, envs.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d'
    });

    await this.usersService.pushRefreshToken(_id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refresh(accessToken: string, refreshToken: string) {
    const accessTokenPayload = jwt.verify(
      accessToken,
      envs.ACCESS_TOKEN_SECRET,
      {
        ignoreExpiration: true
      }
    ) as JwtPayload;

    const refreshTokenPayload = jwt.verify(
      refreshToken,
      envs.REFRESH_TOKEN_SECRET
    ) as JwtPayload;

    if (accessTokenPayload._id !== refreshTokenPayload._id)
      throw new ForbiddenException();

    const id = new ObjectId(refreshTokenPayload._id);

    const isRefreshTokenExisted = await this.usersService.isRefreshTokenExisted(
      id,
      refreshToken
    );

    if (!isRefreshTokenExisted) throw new ForbiddenException();

    await this.usersService.removeRefreshToken(id, refreshToken);

    return this.loginById(id);
  }
}
