import { Calendar } from './Calendar'
import { Event } from './Event'
import { HolidayCalendar } from './HolidayCalendar'
import { ReminderDispatcher } from './ReminderDispatcher'
import { SlackReminder } from './SlackReminder'
import { Tracker } from './Tracker'
import { TrackerEvent } from './TrackerEvent'

export class App {
  protected readonly source: Calendar
  protected readonly holidays: HolidayCalendar
  protected readonly infra: Infra
  protected readonly reminder: ReminderDispatcher

  constructor(
    commonCalendarId: string,
    holidaysCalendarId: string,
    infra: Infra
  ) {
    this.source = new Calendar(commonCalendarId)
    this.holidays = new HolidayCalendar(holidaysCalendarId)
    this.infra = infra
    this.reminder = new ReminderDispatcher(this.holidays, {
      sendSlackReminder: infra.sendSlackReminder,
    })
  }

  public start() {
    this.source.setEvents(this.infra.findCalendarEvents(this.source))
    this.holidays.setEvents(this.infra.findCalendarEvents(this.holidays))

    const trackers = this.infra.getTrackers()
    for (const tracker of trackers) {
      this.setTrackerEventsAndUpdateMissing(tracker)
    }

    for (const tracker of trackers) {
      this.infra.saveTrackerEvents(tracker)
      this.reminder.notifySubscribers(tracker)
    }
  }

  protected setTrackerEventsAndUpdateMissing(tracker: Tracker) {
    tracker.setCalendarEvents(
      this.infra.findCalendarEvents(tracker.getCalendar()) as TrackerEvent[]
    )
    tracker.updateMissingEvents(this.source)
  }
}

export interface Infra {
  findCalendarEvents(calendar: Calendar): Event[]
  getTrackers(): Tracker[]
  saveTrackerEvents(tracker: Tracker): void
  sendSlackReminder(reminder: SlackReminder): void
}
