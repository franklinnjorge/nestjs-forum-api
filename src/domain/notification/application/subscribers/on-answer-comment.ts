import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/entities/events/answer-created-event'
import { SendNotificationUseCase } from '../use-case/send-notification'

export class OnAnswerComment implements EventHandler {
  constructor(
    private questionsCommentsRepository: QuestionCommentsRepository,
    private sendNotificationUseCase: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      OnAnswerComment.name
    )
  }

  private async sendNewAnswerCommentNotification({
    answer
  }: AnswerCreatedEvent) {
    const question = await this.questionsCommentsRepository.findById(
      answer.questionId.toString()
    )

    if (question) {
      this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toValue(),
        title: `You have a new answer`,
        content: answer.excerpt
      })
    }
  }
}
