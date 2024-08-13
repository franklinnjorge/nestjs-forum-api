import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import PrismaService from '@/prisma/prisma.service'
import { z } from 'zod'

const authenticatorBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

type AuthenticatorBodySchema = z.infer<typeof authenticatorBodySchema>

@Controller('/session')
export class AuthenticationController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticatorBodySchema))
  async handle(@Body() body: AuthenticatorBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const token = this.jwt.sign({ sub: user.id })

    return {
      access_token: token
    }
  }
}
