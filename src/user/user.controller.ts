import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@Req() request: Request) {
    return request.user
  }

  @Get(':id/bookmarks')
  getBookmarksByUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getBookmarksByUser(id)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id)
  }
}
