import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { ZodValidationPipe } from '@/infra/http/controllers/pipes/zod-validation-pipe'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'

const authenticatorBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

type AuthenticatorBodySchema = z.infer<typeof authenticatorBodySchema>

@Controller('/session')
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
      throw new Error()
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken
    }
  }
}
