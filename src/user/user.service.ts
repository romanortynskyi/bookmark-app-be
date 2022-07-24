import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  async getBookmarksByUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new BadRequestException('User is not found')
    }

    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    })

    return bookmarks
  }

  async deleteUser(id: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })
    
    if (!user) {
      throw new BadRequestException('User is not found')
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    })
  }
}
