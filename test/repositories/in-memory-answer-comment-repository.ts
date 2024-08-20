import { PaginationParams } from '@/core/repositories/pagination'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comments'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find(
      (answer) => answer.id.toString() === id
    )

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerCommentId(
    answerId: string,
    { page }: PaginationParams
  ) {
    const answerComment = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComment
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const findIndex = this.items.findIndex(
      (items) => items.id === answerComment.id
    )

    this.items.splice(findIndex, 1)
  }
}
