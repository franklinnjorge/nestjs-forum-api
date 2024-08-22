import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/controllers/pipes/zod-validation-pipe'
import { z } from 'zod'
import PrismaService from '@/infra/database/prisma/prisma.service'

const pageQuery = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQuery)

type PageQueryParams = z.infer<typeof pageQuery>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchQuestionListController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParams) {
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'asc'
      },
      take: perPage,
      skip: (page - 1) * perPage
    })

    return {
      questions
    }
  }
}
