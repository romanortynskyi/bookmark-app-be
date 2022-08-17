import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2'

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginRequestDto, SignUpRequestDto } from './dto';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  
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
      throw new ForbiddenException('EMAIL_ALREADY_EXISTS')
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

    const token = await this.signToken(user)

    return {
      ...user,
      token,
    }
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
      throw new ForbiddenException('WRONG_EMAIL_OR_PASSWORD')
    }

    const passwordIsCorrect = await argon.verify(user.hash, password)

    if (!passwordIsCorrect) {
      throw new ForbiddenException('WRONG_EMAIL_OR_PASSWORD')
    }

    const token = await this.signToken(user)

    return {
      ...user,
      token,
    }
  }

  signToken(user) {
    const secret = this.config.get('JWT_SECRET')

    return this.jwt.signAsync(user, {
      expiresIn: '365d',
      secret,
    })
  }

}
