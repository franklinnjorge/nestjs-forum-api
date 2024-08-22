import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/controllers/pipes/zod-validation-pipe'
import PrismaService from '@/infra/database/prisma/prisma.service'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>
@Controller('/account')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
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
