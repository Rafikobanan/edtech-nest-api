import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('info')
  @UseGuards(JwtAuthGuard)
  login(@Req() req: Request) {
    return this.usersService.getUserInfo(req.user);
  }
}
