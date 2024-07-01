import { Email } from './Email'
import { Subscriber } from './Subscriber'

export class Reminder {
  protected readonly vacations: Vacation[]
  protected readonly subscriber: Subscriber
  protected readonly timeline: Timeline
  protected readonly name: string
  constructor(
    name: string,
    vacations: Vacation[],
    subscriber: Subscriber,
    timeline: Timeline
  ) {
    this.name = name
    this.vacations = vacations
    this.subscriber = subscriber
    this.timeline = timeline
  }

  public getSubscriber() {
    return this.subscriber
  }

  public getVacationsGroups() {
    const groups: Array<[email: Email, days: ReminderDay[]]> = []
    for (const user of this.timeline.users) {
      groups.push([
        user,
        this.createDays(
          this.vacations.filter((x) => x.getEmail().equals(user))
        ),
      ])
    }
    return groups
  }

  protected createDays(vacations: Vacation[]): ReminderDay[] {
    const days: ReminderDay[] = []
    const d0 = new Date(this.timeline.d0.getDate())
    for (let daysAhead = 0; daysAhead < this.timeline.size; daysAhead++) {
      const date = new Date(d0)
      date.setDate(date.getDate() + daysAhead)
      const day = new Day(date)
      days.push({
        day,
        type: day.isWeekend()
          ? ReminderDayType.Weekend
          : this.holidayThatDay(day)
          ? ReminderDayType.Holiday
          : this.vacationThatDay(day, vacations)
          ? ReminderDayType.Vacation
          : ReminderDayType.Workday,
      })
    }
    return days
  }

  protected holidayThatDay(day: Day) {
    return this.timeline.holidays.find((x) => x.equals(day))
  }

  protected vacationThatDay(day: Day, pool: Vacation[]) {
    return pool.find((x) => x.getDay().equals(day))
  }
}

export enum ReminderDayType {
  Vacation,
  Holiday,
  Workday,
  Weekend,
}

export interface ReminderDay {
  type: ReminderDayType
  day: Day
}

const SUNDAY = 0
const SATURDAY = 6

export class Day {
  protected readonly date: Date
  constructor()
  constructor(date: Date)
  constructor(date?: Date) {
    if (date === undefined) {
      this.date = new Date()
    } else {
      this.date = new Date(date)
    }
  }
  public equals(b: Day) {
    return (
      b.date.getDate() === this.date.getDate() &&
      b.date.getMonth() === this.date.getMonth() &&
      b.date.getFullYear() === this.date.getFullYear()
    )
  }

  public isWeekend() {
    return this.date.getDay() === SATURDAY || this.date.getDay() === SUNDAY
  }

  public toString() {
    return `${this.date.getFullYear()}-${String(
      this.date.getMonth() + 1
    ).padStart(2, '0')}-${String(this.date.getDate()).padStart(2, '0')}`
  }

  public compare(b: Day) {
    return this.date.getTime() - b.date.getTime()
  }

  public getDate() {
    return this.date
  }
}

export class Vacation {
  protected readonly day: Day
  protected readonly email: Email
  constructor(day: Day, email: Email) {
    this.day = day
    this.email = email
  }

  public getDay() {
    return this.day
  }

  public getEmail() {
    return this.email
  }
}

export interface Timeline {
  d0: Day
  size: number
  holidays: Day[]
  users: Email[]
}
