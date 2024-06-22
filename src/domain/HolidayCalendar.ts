import { Calendar } from './Calendar'

export class HolidayCalendar extends Calendar {
  public getDays() {
    return this.events.map(x => {
      return x.getTime().getStart()
    })
  }
  public getRequiredEventText() {
    return ''
  }
}
