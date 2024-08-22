import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/controllers/pipes/zod-validation-pipe'
import { z } from 'zod'
import PrismaService from '@/infra/database/prisma/prisma.service'

const createQuestion = z.object({
  title: z.string(),
  content: z.string()
})

type CreateQuestionSchema = z.infer<typeof createQuestion>

const bodyValidationPipe = new ZodValidationPipe(createQuestion)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreationQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionSchema
  ) {
    const { title, content } = body
    const userId = user.sub
    const slug = this.generateSlug(title)

    await this.prisma.question.create({
      data: {
        title,
        slug,
        authorId: userId,
        content
      }
    })
  }

  private generateSlug(title: string) {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
    return slug
  }
}
