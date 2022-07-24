import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkRequestDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async addBookmark(dto: BookmarkRequestDto) {
    const {
      userId,
      title,
      description,
      link,
    } = dto

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new BadRequestException('User is not found')
    }

    const bookmark = await this.prisma.bookmark.create({
      data: {
        title,
        description,
        link,
        userId,

      },
    })

    return bookmark
  }

  async updateBookmark(id: number, dto: BookmarkRequestDto) {
    const {
      userId,
      title,
      description,
      link,
    } = dto

    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id,
      },
    })

    if (!bookmark) {
      throw new BadRequestException('Bookmark is not found')
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new BadRequestException('User is not found')
    }

    const updatedBookmark = await this.prisma.bookmark.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        link,
        userId,
      },
    })

    return updatedBookmark
  }

  async deleteBookmark(id: any) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id,
      },
    })

    if (!bookmark) {
      throw new BadRequestException('Bookmark is not found')
    }

    await this.prisma.bookmark.delete({
      where: {
        id,
      },
    })
  }
}
