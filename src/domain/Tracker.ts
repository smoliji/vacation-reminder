import { Calendar } from './Calendar'
import { Email } from './Email'
import { Subscriber } from './Subscriber'
import { TrackerCalendar } from './TrackerCalendar'
import { TrackerEvent } from './TrackerEvent'

export class Tracker {
  protected readonly name: string
  protected readonly subjects: Email[]
  protected readonly calendar: TrackerCalendar
  protected readonly subscribers: Subscriber[]

  constructor(
    name: string,
    subjects: Email[],
    calendar: TrackerCalendar,
    subscribers: Subscriber[]
  ) {
    this.name = name
    this.subjects = subjects
    this.calendar = calendar
    this.subscribers = subscribers
  }

  public getDisplayName() {
    return this.name
  }

  public getCalendar() {
    return this.calendar
  }

  public getSubscribers() {
    return this.subscribers
  }

  public getSubjects() {
    return this.subjects
  }

  public setCalendarEvents(events: TrackerEvent[]) {
    this.calendar.setEvents(events)
  }

  public updateMissingEvents(calendar: Calendar) {
    this.calendar.updateMissingEvents(calendar, this.subjects)
  }
}
