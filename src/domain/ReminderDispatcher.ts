import { Email } from './Email'
import { Event } from './Event'
import { HolidayCalendar } from './HolidayCalendar'
import { Day, Reminder, Vacation } from './Reminder'
import { SlackReminder } from './SlackReminder'
import { SlackSubscriber } from './SlackSubscriber'
import { Tracker } from './Tracker'

export class ReminderDispatcher {
  protected readonly infra: Infra
  protected readonly holidays: HolidayCalendar

  static readonly TIMELINE_LENGTH = 14

  constructor(holidays: HolidayCalendar, infra: Infra) {
    this.infra = infra
    this.holidays = holidays
  }

  public notifySubscribers(tracker: Tracker) {
    for (const subscriber of tracker.getSubscribers()) {
      if (subscriber instanceof SlackSubscriber) {
        const reminder = this.createSlackReminder(tracker, subscriber)
        this.infra.sendSlackReminder(reminder)
      }
    }
  }

  protected createSlackReminder(
    tracker: Tracker,
    subscriber: SlackSubscriber
  ): Reminder {
    const events = this.getTrackerEventsAfterUpdate(tracker)
    const vacations = this.generateVecations(events)
    return new SlackReminder(tracker.getDisplayName(), vacations, subscriber, {
      size: ReminderDispatcher.TIMELINE_LENGTH,
      d0: new Day(),
      holidays: this.holidays.getDays().map((x) => new Day(x)),
      users: tracker.getSubjects(),
    })
  }

  protected generateVecations(events: Event[]) {
    const vacations: Vacation[] = []
    for (const event of events) {
      const time = event.getTime()
      if (time.isAllDay()) {
        this.createAllDayEventVacations(event, vacations)
      } else {
        this.createTimeEventVacations(event, vacations)
      }
    }
    this.sortVacations(vacations)
    return vacations
  }

  protected createAllDayEventVacations(event: Event, existing: Vacation[]) {
    const iter = new Date(event.getTime().getStart())
    while (iter < event.getTime().getEnd()) {
      const exists = !!existing.find(
        (vacation) =>
          vacation.getEmail().equals(event.getEmail()) &&
          vacation.getDay().equals(new Day(iter))
      )
      if (!exists) {
        existing.push(
          new Vacation(new Day(iter), new Email(event.getEmail().getEmail()))
        )
      }
      iter.setDate(iter.getDate() + 1)
    }
  }

  protected createTimeEventVacations(event: Event, existing: Vacation[]) {
    existing.push(
      new Vacation(
        new Day(event.getTime().getStart()),
        new Email(event.getEmail().getEmail())
      )
    )
  }

  protected sortVacations(vacations: Vacation[]) {
    vacations.sort(
      (a, b) =>
        a.getEmail().getEmail().localeCompare(b.getEmail().getEmail()) ||
        a.getDay().compare(b.getDay())
    )
  }

  protected getTrackerEventsAfterUpdate(tracker: Tracker) {
    const missing = tracker.getCalendar().getMissingEvents()
    const extra = tracker.getCalendar().getExtraEvents()
    const current = tracker.getCalendar().getEvents()
    const final = current
      .filter((current) => !extra.find((missing) => current.equals(missing)))
      .concat(missing)
    return final
  }
}

export interface Infra {
  sendSlackReminder(reminder: Reminder): void
}
