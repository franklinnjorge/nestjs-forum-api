import { PaginationParams } from '@/core/repositories/pagination'
import { QuestionComment } from '../../enterprise/entities/question-comments'

export interface QuestionCommentsRepository {
  create(questionComment: QuestionComment): Promise<void>
  findById(id: string): Promise<QuestionComment | null>
  findManyByQuestionCommentId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>
  delete(questionComment: QuestionComment): Promise<void>
}
