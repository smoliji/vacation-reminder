import { Email } from './Email'

export class Event {
  protected readonly name: string
  protected readonly description: string
  protected readonly id: string
  protected readonly author: Email
  protected readonly time: Time

  constructor(id: string, name: string, description: string, author: Email, time: Time) {
    this.id = id
    this.name = name
    this.author = author
    this.time = time
    this.description = description
  }

  public getName() {
    return this.name
  }

  public equals(event: Event): boolean {
    return event.getId() === this.getId()
  }

  public getDescription() {
    return this.description
  }

  public getTime() {
    return this.time
  }

  public includesEmail(email: Email) {
    return this.author.equals(email)
  }

  public getId(): string {
    return this.id
  }

  public getEmail(): Email {
    return this.author
  }
}

export class Time {
  protected readonly start: Date
  protected readonly end: Date
  protected readonly allDay: boolean

  constructor(start: Date, end: Date, allDay: boolean) {
    this.start = new Date(start)
    this.end = new Date(end)
    this.allDay = allDay
  }

  public getStart() {
    return this.start
  }

  public getEnd() {
    return this.end
  }

  public isAllDay() {
    return this.allDay
  }
}

