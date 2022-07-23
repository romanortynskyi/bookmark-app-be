import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2'

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginRequestDto, SignUpRequestDto } from './dto';


@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  
  async signUp(dto: SignUpRequestDto) {
    const {
      password,
      firstName,
      lastName,
      email,
    } = dto

    const existingUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (existingUser) {
      throw new ForbiddenException('Email already exists')
    }

    const hash = await argon.hash(password)

    const user = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        hash, 
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user;
  }

  async login(dto: LoginRequestDto) {
    const {
      email,
      password,
    } = dto

    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      throw new ForbiddenException('Wrong email or password')
    }

    const passwordIsCorrect = await argon.verify(user.hash, password)

    if (!passwordIsCorrect) {
      throw new ForbiddenException('Wrong email or password')
    }

    return user
  }

}
