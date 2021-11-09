import { cookies } from '../config';
import {
  Controller,
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
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';

@Controller('api/auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('local-login'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const { accessToken, refreshToken } = await this.usersService.loginById(
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

    return { accessToken };
  }

  @UseGuards(AuthGuard('local-signup'))
  @Post('registration')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async registration() {}

  @Get('activate/:link')
  async verifyEmail(
    @Param('link') link: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const _id = await this.usersService.verifyEmail(link).catch(() => {
      throw new NotFoundException();
    });

    const { accessToken, refreshToken } = await this.usersService.loginById(
      _id
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
}
