import { Email } from './Email'
import { Event } from './Event'

export class Calendar {
  protected readonly id: string
  protected events: Event[] = []

  constructor(id: string) {
    this.id = id
  }

  public getId(): string {
    return this.id
  }

  public setEvents(events: Event[]) {
    this.events = events
  }

  public getEventRange() {
    const a = new Date()
    a.setMonth(a.getMonth() - 1)
    const b = new Date()
    b.setMonth(b.getMonth() + 3)
    return [a, b] as const
  }

  public getRequiredEventText(): string {
    return '🌴'
  }

  public filterEventsForEmails(emails: Email[]) {
    return this.events.filter(
      (event) => !!emails.find((email) => event.includesEmail(email))
    )
  }
}
