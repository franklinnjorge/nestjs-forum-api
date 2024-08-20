import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  constructor() {}

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification) {
    const findIndex = this.items.findIndex(
      (items) => items.id.toString() === notification.id.toString()
    )

    this.items[findIndex] = notification
  }

  async findById(slug: string): Promise<Notification | null> {
    const notification = this.items.find(
      (notification) => notification.id.toString() === slug
    )

    if (!notification) {
      return null
    }

    return notification
  }
}
