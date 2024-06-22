import { Reminder, ReminderDayType } from './Reminder'
import { SlackSubscriber } from './SlackSubscriber'

const WORKDAY = '🗓'
const WEEKEND = '🌞'
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
    const data = this.getVacationsGroups()
    let text = 'See the $1-day vacation overview for `$2`\n▼ Today\n'
      .replace('$1', String(this.timeline.size))
      .replace('$2', this.name)
    data.forEach(([user, days]) => {
      days.forEach((day) => {
        const symbol = SYMBOL_MAP[day.type] || WORKDAY
        text += symbol
      })
      text += ` —${user.getEmail()}\n`
    })
    return {
      text: text,
    }
  }
  public getSubscriber(): SlackSubscriber {
    return this.subscriber as SlackSubscriber
  }
}
