import { App } from './domain/App'
import {
  findCalendarEvents,
  saveTrackerEvents,
} from './infra/calendars.appscripts'
import { sendSlackReminder } from './infra/notifs.slack'
import { getTrackers } from './infra/sheettrackers.appscript'

export function start(param: {
  TRACKER_DOC_ID: string
  TRACKER_SHEET_NAME: string
  COMMON_CALENDAR_ID: string
  SLACK_TOKEN: string
  HOLIDAY_CAL_ID: string
}) {
  return new App(param.COMMON_CALENDAR_ID, param.HOLIDAY_CAL_ID, {
    findCalendarEvents: (cal) => {
      console.log(
        'Looking for calendar events in Cal ID $1...'.replace('$1', cal.getId())
      )
      const result = findCalendarEvents(cal)
      console.log('Found $1 events'.replace('$1', String(result.length)))
      return result
    },
    getTrackers: () => {
      console.log('Looking for trackers...')
      const result = getTrackers(param.TRACKER_DOC_ID, param.TRACKER_SHEET_NAME)
      if (result.length) {
        console.log(
          'Found $1 trackers ($2)'
            .replace('$1', String(result.length))
            .replace('$2', result.map((x) => x.getDisplayName()).join(', '))
        )
      } else {
        console.log('No trackers found')
      }
      return result
    },
    saveTrackerEvents: (tracker) => {
      console.log(
        'Saving tracker $1 ($2 events missing, $3 will be removed)'
          .replace('$1', tracker.getDisplayName())
          .replace(
            '$2',
            String(tracker.getCalendar().getMissingEvents().length)
          )
          .replace('$3', String(tracker.getCalendar().getExtraEvents().length))
      )
      const result = saveTrackerEvents(tracker)
      console.log('Tracker $1 saved'.replace('$1', tracker.getDisplayName()))
      return result
    },
    sendSlackReminder: (reminder) => {
      console.log(
        'Sending slack reminder to $1...'.replace(
          '$1',
          reminder.getSubscriber().getChannel()
        )
      )
      sendSlackReminder(param.SLACK_TOKEN, reminder)
      console.log('Sent message:\n$1'.replace('$1', reminder.getMessage().text))
    },
  }).start()
}
