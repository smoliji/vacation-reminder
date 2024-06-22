import test, { describe } from 'node:test'
import { TrackerCalendar } from './TrackerCalendar'
import { Email } from './Email'
import { equal } from 'node:assert'
import { Event, Time } from './Event'

describe('TrackerCalendar', () => {
  test('Calling updateMissingEvents sets missing and extra events', () => {
    const a = new TestCalendar([
      ['1', 'alice@example.com'],
      ['2', 'bob@example.com'],
      ['3', 'carol@example.com'],
      ['4', 'david@example.com'],
      ['5', 'alice@example.com'],
    ])
    const b = new TestCalendar([
      ['1', 'alice@example.com'],
      ['x', 'bob@example.com'],
      ['y', 'bob@example.com'],
    ])
    b.updateMissingEvents(a, [
      new Email('alice@example.com'),
      new Email('bob@example.com'),
    ])
    equal(
      b
        .getMissingEvents()
        .map((x) => x.getId())
        .join(','),
      '2,5'
    )
    equal(
      b
        .getExtraEvents()
        .map((x) => x.getId())
        .join(','),
      'x,y'
    )
  })
})

class TestCalendar extends TrackerCalendar {
  constructor(events: Array<[id: string, email: string]>) {
    super('test')
    this.setEvents(
      events.map(
        (x) =>
          new Event(
            x[0],
            'test',
            '',
            new Email(x[1]),
            new Time(new Date(), new Date(), false)
          )
      )
    )
  }
}
