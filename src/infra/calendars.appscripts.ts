import { Calendar } from '../domain/Calendar'
import { Email } from '../domain/Email'
import { EmailAddressParser } from '../domain/EmailAddressParser'
import { Event, Time } from '../domain/Event'
import { HolidayCalendar } from '../domain/HolidayCalendar'
import { Tracker } from '../domain/Tracker'
import { TrackerCalendar } from '../domain/TrackerCalendar'
import { TrackerEvent } from '../domain/TrackerEvent'
import { TrackerEventDescription } from './TrackerEventDescription'

export function findCalendarEvents(calendar: Calendar): Event[] {
  const events = CalendarApp.getCalendarById(calendar.getId())?.getEvents(
    calendar.getEventRange()[0],
    calendar.getEventRange()[1],
    {
      search: calendar.getRequiredEventText(),
    }
  )
  if (!events) return []
  const result: Event[] = []
  for (const event of events) {
    try {
      result.push(buildEvent(calendar, event))
    } catch {}
  }
  return result

  function buildEvent(
    calendar: Calendar,
    event: GoogleAppsScript.Calendar.CalendarEvent
  ): Event {
    if (calendar instanceof TrackerCalendar) {
      return buildTrackerEvent(event)
    }
    if (calendar instanceof HolidayCalendar) {
      return buildHolidayEvent(event)
    }
    return buildNormalEvent(event)
  }

  function buildTrackerEvent(
    event: GoogleAppsScript.Calendar.CalendarEvent
  ): TrackerEvent {
    const description = TrackerEventDescription.unmarshal(
      event.getDescription()
    )
    return new TrackerEvent(event.getId(), description)
  }

  function buildHolidayEvent(
    event: GoogleAppsScript.Calendar.CalendarEvent
  ): Event {
    return new Event(
      event.getId(),
      event.getTitle(),
      event.getDescription(),
      new Email(event.getOriginalCalendarId()),
      new Time(
        new Date(
          event.isAllDayEvent()
            ? event.getAllDayStartDate().getTime()
            : event.getStartTime().getTime()
        ),
        new Date(
          event.isAllDayEvent()
            ? event.getAllDayEndDate().getTime()
            : event.getEndTime().getTime()
        ),
        event.isAllDayEvent()
      )
    )
  }

  function buildNormalEvent(
    event: GoogleAppsScript.Calendar.CalendarEvent
  ): Event {
    return new Event(
      event.getId(),
      event.getTitle(),
      event.getDescription(),
      new EmailAddressParser(
        event.getGuestList()[0]?.getEmail() ?? event.getCreators()[0] ?? ''
      ).parseOne(),
      new Time(
        new Date(
          event.isAllDayEvent()
            ? event.getAllDayStartDate().getTime()
            : event.getStartTime().getTime()
        ),
        new Date(
          event.isAllDayEvent()
            ? event.getAllDayEndDate().getTime()
            : event.getEndTime().getTime()
        ),
        event.isAllDayEvent()
      )
    )
  }
}

export function saveTrackerEvents(tracker: Tracker) {
  const calendar = tracker.getCalendar()
  const remote = CalendarApp.getCalendarById(calendar.getId())
  for (const event of calendar.getExtraEvents()) {
    remote.getEventById(event.getTrackerEventId()).deleteEvent()
  }
  for (const event of calendar.getMissingEvents()) {
    const description = TrackerEventDescription.marshal({
      originalDescription: event.getDescription(),
      originalId: event.getId(),
      originalName: event.getName(),
      originalTime: event.getTime(),
      originalUser: event.getEmail(),
    })
    if (event.getTime().isAllDay()) {
      remote.createAllDayEvent(
        event.getName(),
        event.getTime().getStart(),
        event.getTime().getEnd(),
        {
          description,
        }
      )
    } else {
      remote.createEvent(
        event.getName(),
        event.getTime().getStart(),
        event.getTime().getEnd(),
        {
          description,
        }
      )
    }
  }
}
