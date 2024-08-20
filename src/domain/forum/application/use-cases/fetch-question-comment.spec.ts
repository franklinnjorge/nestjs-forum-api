import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comment'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: FetchQuestionCommentsUseCase
describe('Fetch Recent Questions UseCase', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
  })
  it('should be able to fetch questions', async () => {
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') })
    )
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') })
    )
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') })
    )

    const result = await sut.execute({
      questionCommentId: 'question-1',
      page: 1
    })

    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch pagination', async () => {
    for (let i = 0; i < 23; i++) {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID('question-1') })
      )
    }

    const result = await sut.execute({
      questionCommentId: 'question-1',
      page: 2
    })

    expect(result.value?.questionComments).toHaveLength(3)
  })
})
