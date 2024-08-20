import { DomainEvent } from '@/core/events/domain-event'
import { Question } from '../question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityID

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.ocurredAt = new Date()
    this.bestAnswerId = bestAnswerId
    this.question = question
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}
