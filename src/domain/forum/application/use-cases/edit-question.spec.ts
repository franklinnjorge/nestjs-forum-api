import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: EditQuestionUseCase
describe('EditQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository
    )

    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentRepository
    )
  })

  it('should be able to edit a question', async () => {
    const question = makeQuestion(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1')
    )

    await inMemoryQuestionsRepository.create(question)

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment(
        { questionId: question.id },
        new UniqueEntityID('attachment-1')
      ),
      makeQuestionAttachment(
        { questionId: question.id },
        new UniqueEntityID('attachment-2')
      )
    )

    await sut.execute({
      authorId: 'author-1',
      questionId: question.id.toValue(),
      title: 'New edited title',
      content: 'New edited content',
      attachmentsIds: ['attachment-1', 'attachment-3']
    })

    expect(inMemoryQuestionsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'New edited title'
      })
    )
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toHaveLength(2)
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-1')
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-3')
      })
    ])
  })
})

it('should not be able to edit a question from another user', async () => {
  const question = makeQuestion(
    { authorId: new UniqueEntityID('author-1') },
    new UniqueEntityID('question-1')
  )

  await inMemoryQuestionsRepository.create(question)

  const result = await sut.execute({
    authorId: 'author-2',
    questionId: 'question-1',
    title: 'New edited title',
    content: 'New edited content',
    attachmentsIds: []
  })

  expect(result.isLeft()).toBe(true)
  expect(result.value).toBeInstanceOf(NotAllowedError)
})
