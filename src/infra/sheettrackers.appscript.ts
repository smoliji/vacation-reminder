import { EmailAddressParser } from '../domain/EmailAddressParser'
import { SlackSubscriber } from '../domain/SlackSubscriber'
import { Tracker } from '../domain/Tracker'
import { TrackerCalendar } from '../domain/TrackerCalendar'

export function getTrackers(
  trackerDocId: string,
  trackerSheetName: string
): Tracker[] {
  const doc = SpreadsheetApp.openById(trackerDocId)
  const sheet = doc.getSheetByName(trackerSheetName)
  if (!sheet) throw new SheetDoesNotExist()
  const dataRange = sheet.getDataRange()
  const rows = dataRange.getValues()
  const trackers: Tracker[] = []
  for (const row of skipHeader(rows)) {
    const [name, calendar, members, slackSubscribers] = row as string[]
    trackers.push(
      new Tracker(
        name,
        new EmailAddressParser(members).parse(),
        new TrackerCalendar(calendar),
        parseSlackSubscribers(slackSubscribers)
      )
    )
  }
  return trackers

  function skipHeader(rows: any[][]) {
    return rows.slice(1)
  }

  function parseSlackSubscribers(x: string) {
    return x
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x!)
      .map((x) => new SlackSubscriber(x))
  }
}

export class SheetDoesNotExist extends Error {}
