import { cookies } from '../config';
import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @UseGuards(AuthGuard('local-login'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const { accessToken, refreshToken } = await this.authService.loginById(
      (req.user as any)._id
    );

    res.cookie(
      cookies.ACCESS_TOKEN,
      accessToken,
      cookies.DEFAULT_COOKIE_OPTIONS
    );

    res.cookie(
      cookies.REFRESH_TOKEN,
      refreshToken,
      cookies.DEFAULT_COOKIE_OPTIONS
    );
  }

  @UseGuards(AuthGuard('local-signup'))
  @Post('register')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async register() {}

  @Get('activate/:link')
  async verifyEmail(
    @Param('link') link: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const _id = await this.usersService.verifyEmail(link).catch(() => {
      throw new NotFoundException();
    });

    const { accessToken, refreshToken } = await this.authService.loginById(_id);

    res.cookie(
      cookies.ACCESS_TOKEN,
      accessToken,
      cookies.DEFAULT_COOKIE_OPTIONS
    );

    res.cookie(
      cookies.REFRESH_TOKEN,
      refreshToken,
      cookies.DEFAULT_COOKIE_OPTIONS
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const { accessToken, refreshToken } = await this.authService.refresh(
        req.cookies[cookies.ACCESS_TOKEN],
        req.cookies[cookies.REFRESH_TOKEN]
      );

      res.cookie(
        cookies.ACCESS_TOKEN,
        accessToken,
        cookies.DEFAULT_COOKIE_OPTIONS
      );

      res.cookie(
        cookies.REFRESH_TOKEN,
        refreshToken,
        cookies.DEFAULT_COOKIE_OPTIONS
      );
    } catch (e) {
      res.cookie(cookies.ACCESS_TOKEN, '', {
        ...cookies.DEFAULT_COOKIE_OPTIONS,
        maxAge: -1
      });

      res.cookie(cookies.REFRESH_TOKEN, '', {
        ...cookies.DEFAULT_COOKIE_OPTIONS,
        maxAge: -1
      });

      throw new ForbiddenException();
    }
  }
}
