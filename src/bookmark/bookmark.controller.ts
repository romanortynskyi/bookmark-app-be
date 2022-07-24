import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { BookmarkRequestDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  addBookmark(@Body() dto: BookmarkRequestDto) {
    return this.bookmarkService.addBookmark(dto)
  }

  @Put(':id')
  updateBookmark(@Param('id', ParseIntPipe) id: number, @Body() dto: BookmarkRequestDto) {
    return this.bookmarkService.updateBookmark(id, dto)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmark(@Param('id', ParseIntPipe) id) {
    return this.bookmarkService.deleteBookmark(id)
  }
}
