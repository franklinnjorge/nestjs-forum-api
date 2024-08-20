import { PaginationParams } from '@/core/repositories/pagination'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comments'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find(
      (question) => question.id.toString() === id
    )

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionCommentId(
    questionId: string,
    { page }: PaginationParams
  ) {
    const questionComment = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComment
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const findIndex = this.items.findIndex(
      (items) => items.id === questionComment.id
    )

    this.items.splice(findIndex, 1)
  }
}
