import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import PrismaService from '@/prisma/prisma.service'
import { z } from 'zod'

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
        createdAt: 'desc'
      },
      take: perPage,
      skip: (page - 1) * perPage
    })

    return {
      questions
    }
  }
}
