import { PaginationParams } from '@/core/repositories/pagination'
import { AnswerComment } from '../../enterprise/entities/answer-comments'

export interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerCommentId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>
  delete(answerComment: AnswerComment): Promise<void>
}
