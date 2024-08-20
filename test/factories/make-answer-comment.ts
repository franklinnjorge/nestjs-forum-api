import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentsProps
} from '@/domain/forum/enterprise/entities/answer-comments'
import { faker } from '@faker-js/faker'

export function makeAnswerComment(
  override: Partial<AnswerCommentsProps> = {},
  id?: UniqueEntityID
) {
  const answercomment = AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override
    },
    id
  )

  return answercomment
}
