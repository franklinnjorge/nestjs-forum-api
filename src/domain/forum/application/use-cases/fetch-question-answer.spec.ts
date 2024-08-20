import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

let sut: FetchQuestionAnswersUseCase
describe('Fetch Answer ', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      answerAttachmentsRepository
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswerRepository)
  })
  it('should be able to fetch answers', async () => {
    await inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') })
    )
    await inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') })
    )
    await inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') })
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1
    })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch answers with pagination', async () => {
    for (let i = 0; i < 23; i++) {
      await inMemoryAnswerRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('question-1') })
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2
    })

    expect(result.value?.answers).toHaveLength(3)
  })
})
