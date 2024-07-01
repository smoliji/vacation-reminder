import { Email } from './Email'
import { Reminder, ReminderDay, ReminderDayType } from './Reminder'
import { SlackSubscriber } from './SlackSubscriber'

const WORKDAY = '🗓️'
const WEEKEND = '   '
const HOLIDAY = '🇨🇿'
const VACADAY = '🌴'

const SYMBOL_MAP: Record<ReminderDayType, string> = {
  [ReminderDayType.Holiday]: HOLIDAY,
  [ReminderDayType.Workday]: WORKDAY,
  [ReminderDayType.Vacation]: VACADAY,
  [ReminderDayType.Weekend]: WEEKEND,
}

export interface SlackMessage {
  text: string
}

export class SlackReminder extends Reminder {
  public getMessage(): SlackMessage {
    const text: string[] = []
    this.printHeader(text)

    this.printUserRows(text)

    return {
      text: text.join(''),
    }
  }

  protected printHeader(writer: string[]) {
    writer.push('*{tracker}*, {size}-day vacations overview, starting {d}.{m}.{yyyy}:\n'
      .replace('{size}', String(this.timeline.size))
      .replace('{tracker}', this.name)
      .replace('{d}', String(this.timeline.d0.getDate().getDate()))
      .replace('{m}', String(this.timeline.d0.getDate().getMonth() + 1))
      .replace('{yyyy}', String(this.timeline.d0.getDate().getFullYear()))
    )
  }

  protected printUserRows(writer: string[]) {
    if (!this.timeline.users.length) {
      this.printNoUsers(writer)
      return
    }
    this.getVacationsGroups().forEach(x => {
      this.printUserRow(writer, x[0], x[1])
    })
  }

  protected printNoUsers(writer: string[]) {
    writer.push('_Tracker has no subjects_\n')
  }

  protected printUserRow(writer: string[], user: Email, days: ReminderDay[]) {
    const symbolDays: string[] = []
    days.forEach(day => {
      const symbol = SYMBOL_MAP[day.type] || WORKDAY
      symbolDays.push(symbol)
    })
    writer.push('{days} — {email}\n'
      .replace('{email}', user.getDisplayName())
      .replace('{days}', symbolDays.join('').trimEnd())
    )
  }

  public getSubscriber(): SlackSubscriber {
    return this.subscriber as SlackSubscriber
  }
}
