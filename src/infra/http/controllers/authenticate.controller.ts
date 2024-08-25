import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/controllers/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes
} from '@nestjs/common'
import { z } from 'zod'

const authenticatorBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

type AuthenticatorBodySchema = z.infer<typeof authenticatorBodySchema>

@Controller('/session')
@Public()
export class AuthenticationController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticatorBodySchema))
  async handle(@Body() body: AuthenticatorBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken
    }
  }
}
