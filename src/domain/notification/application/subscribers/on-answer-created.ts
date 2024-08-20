import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/entities/events/answer-created-event'
import { SendNotificationUseCase } from '../use-case/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString()
    )

    if (question) {
      this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toValue(),
        title: `You have a new answer on "${question.title.substring(0, 40).concat('...')}"`,
        content: answer.excerpt
      })
    }
  }
}
