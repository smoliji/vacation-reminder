import { Email } from './Email'
import { Reminder, ReminderDay, ReminderDayType } from './Reminder'
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
    
    let text = 'See the $1-day vacation overview for `$2`\n'
      .replace('$1', String(this.timeline.size))
      .replace('$2', this.name)

    const rows = this.createUserRows()
    if (rows.length) {
      text += '▼ Today\n'
      text += rows.join('\n')
    } else {
      text += '_Tracker has no subjects_\n'
    }
    return {
      text: text,
    }
  }

  protected createUserRows(): string[] {
    const data = this.getVacationsGroups()
    return data.map(([user, days]) =>
      this.createUserRow(user, days)
    )
  }

  protected createUserRow(user: Email, days: ReminderDay[]): string {
    let text = ''
    days.forEach((day) => {
      const symbol = SYMBOL_MAP[day.type] || WORKDAY
      text += symbol
    })
    text += ` —${user.getEmail()}\n`
    return text
  }

  public getSubscriber(): SlackSubscriber {
    return this.subscriber as SlackSubscriber
  }
}
