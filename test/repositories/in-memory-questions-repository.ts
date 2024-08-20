import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find(
      (question) => question.id.toString() === id
    )

    if (!question) {
      return null
    }

    return question
  }

  async create(question: Question) {
    this.items.push(question)
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((question) => question.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findMany({ page }: PaginationParams) {
    return this.items
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
  }

  async delete(question: Question): Promise<void> {
    const findIndex = this.items.findIndex(
      (items) => items.id.toString() === question.id.toString()
    )

    this.items.splice(findIndex, 1)
    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString()
    )
  }

  async save(question: Question) {
    const findIndex = this.items.findIndex(
      (items) => items.id.toString() === question.id.toString()
    )

    this.items[findIndex] = question
    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
