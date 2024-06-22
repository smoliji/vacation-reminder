import { Calendar } from './Calendar'
import { Email } from './Email'
import { Event } from './Event'
import { TrackerEvent } from './TrackerEvent'

export class TrackerCalendar extends Calendar {
  protected missingEvents: Event[] = []
  protected extraEvents: TrackerEvent[] = []
  public updateMissingEvents(source: Calendar, emails: Email[]) {
    const sourceEvents = source.filterEventsForEmails(emails)
    this.missingEvents = sourceEvents.filter(
      (sourceEvent) =>
        !this.events.find((localEvent) => sourceEvent.equals(localEvent))
    )
    this.extraEvents = (this.events as TrackerEvent[]).filter(
      (localEvent) =>
        !sourceEvents.find((sourceEvent) => sourceEvent.equals(localEvent))
    )
  }

  public getMissingEvents() {
    return this.missingEvents
  }

  public getExtraEvents() {
    return this.extraEvents
  }

  public getEvents() {
    return this.events
  }
}
