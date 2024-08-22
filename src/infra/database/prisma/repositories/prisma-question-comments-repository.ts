import { PaginationParams } from '@/core/repositories/pagination'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comments'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  create(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.')
  }
  findManyByQuestionCommentId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.')
  }
  delete(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
