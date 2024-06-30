import { Email } from './Email'
import { Day, Reminder } from './Reminder'
import { SlackSubscriber } from './SlackSubscriber'

export interface SlackMessage {
  text: string
}

export class SlackReminder extends Reminder {
  public getMessage(): SlackMessage {
    let text = `${this.createHeader()}\n`

    if (!this.timeline.users.length) {
      return {
        text: 'No subjects',
      }
    }
    this.getWeekGroups().forEach((group) => {
      text += 'Week {week} ({d}.{m}.{y})\n'
        .replace('{week}', String(group.number))
        .replace('{d}', String(group.start.getDate()))
        .replace('{m}', String(group.start.getMonth() + 1))
        .replace('{y}', String(group.start.getFullYear()))
      if (group.holidays.length) {
        text += ' • 🇨🇿 {n} national holidays\n'
          .replace('{n}', String(group.holidays.length))
      }
      group.vacationeers.forEach((x) => {
        text += this.getVacationeerRow(x.name, x.days) + '\n'
      })
      if (group.workers.length) {
        text += ' • No vacations for {xy}\n'.replace(
          '{xy}',
          group.workers.map((x) => x.getDisplayName()).join(', ')
        )
      }
      text += '\n'
    })
    return {
      text: text,
    }
  }

  protected getVacationeerRow(email: Email, days: Day[]) {
    return ` • 🌴 {user} — {len} days`
      .replace('{user}', email.getDisplayName())
      .replace('{len}', String(days.length))
  }

  protected createHeader(): string {
    return '📅 Upcoming *{team}* vacations for the next {days} days'
      .replace('{team}', this.name)
      .replace('{days}', String(this.timeline.size))
  }

  public getSubscriber(): SlackSubscriber {
    return this.subscriber as SlackSubscriber
  }
}
