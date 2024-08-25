import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/controllers/pipes/zod-validation-pipe'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { QuestionPresenter } from '../presenters/question-presenter'

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
  constructor(private fetchQuestionList: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParams) {
    const result = await this.fetchQuestionList.execute({ page })

    if (result.isLeft()) {
      throw new Error('error')
    }

    const questions = result.value.questions

    return {
      questions: questions.map(QuestionPresenter.toHttp)
    }
  }
}
