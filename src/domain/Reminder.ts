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

  public getWeekGroups() {
    type Week = {
      id: string
      number: number
      start: Date
      vacationeers: Array<{ name: Email; days: Day[] }>
      workers: Email[]
      holidays: Day[]
    }
    const groups: Week[] = []
    const d0 = new Date(this.timeline.d0.getDate())
    for (let daysAhead = 0; daysAhead < this.timeline.size; daysAhead++) {
      const date = new Date(d0)
      date.setDate(date.getDate() + daysAhead)
      const week = getWeek(date)
      if (groups.at(-1)?.id === week.id) {
        continue
      }
      const group: Week = {
        id: week.id,
        number: week.number,
        start: week.start,
        vacationeers: [],
        workers: [],
        holidays: this.timeline.holidays.filter(
          (x) => x.getWeek().id === week.id
        ),
      }
      this.timeline.users.forEach((user) => {
        const vacations = this.vacations
          .filter((x) => x.getEmail().equals(user))
          .filter((x) => x.getDay().getWeek().id === week.id)
        if (vacations.length) {
          group.vacationeers.push({
            name: user,
            days: vacations.map((x) => x.getDay()),
          })
        } else {
          group.workers.push(user)
        }
      })
      groups.push(group)
    }
    return groups
  }

  protected holidayThatDay(day: Day) {
    return this.timeline.holidays.find((x) => x.equals(day))
  }

  protected vacationThatDay(day: Day, pool: Vacation[]) {
    return pool.find((x) => x.getDay().equals(day))
  }
}

export class Day {
  protected readonly date: Date
  static SUNDAY = 0
  static SATURDAY = 6
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

  public getWeek() {
    return getWeek(this.date)
  }

  public isWeekend() {
    return (
      this.date.getDay() === Day.SATURDAY || this.date.getDay() === Day.SUNDAY
    )
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

/**
 * src https://bito.ai/resources/javascript-get-week-number-javascript-explained/
 * src https://www.w3resource.com/javascript-exercises/javascript-date-exercise-50.php
 **/
function getWeek(date: Date): { id: string; number: number; start: Date } {
  // Copy date so don't modify original
  date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  // Get first day of year
  var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  )
  const startDate = new Date(date)
  const diff =
    startDate.getDate() -
    startDate.getDay() +
    (startDate.getDay() === 0 ? -6 : 1)
  return {
    id: `${startDate.getFullYear()}-${weekNo}`,
    number: weekNo,
    start: new Date(startDate.setDate(diff)),
  }
}
