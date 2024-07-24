import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'
@Controller('/api/account')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, password } = body

    const userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    const hashedPassword = await hash(password, 8)

    if (userAlreadyExists) {
      throw new ConflictException('Email already exists')
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })
  }
}
