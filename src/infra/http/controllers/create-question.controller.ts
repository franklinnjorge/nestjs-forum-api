import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/controllers/pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

const createQuestion = z.object({
  title: z.string(),
  content: z.string()
})

type CreateQuestionSchema = z.infer<typeof createQuestion>

const bodyValidationPipe = new ZodValidationPipe(createQuestion)

@Controller('/questions')
export class CreationQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionSchema
  ) {
    const { title, content } = body
    const userId = user.sub

    const result = await this.createQuestion.execute({
      authorId: userId,
      content,
      title,
      attachmentsIds: []
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
