import test, { describe } from 'node:test'
import { Calendar } from './Calendar'
import { Event, Time } from './Event'
import { Email } from './Email'
import { equal } from 'node:assert'

describe('Calendar', () => {
  test('filterEventsForEmails returns only events that includes given emails', () => {
    const calendar = new Calendar('test')
    calendar.setEvents([
      new TestEvent('1', '01@example.com'),
      new TestEvent('2', '02@example.com'),
      new TestEvent('3', '03@example.com'),
      new TestEvent('4', '02@example.com'),
    ])
    const result = calendar.filterEventsForEmails([new Email('02@example.com')])
    equal(result.map((x) => x.getId()).join(','), '2,4')
  })
})

class TestEvent extends Event {
  constructor(id: string, email: string) {
    super(
      id,
      'test',
      '',
      new Email(email),
      new Time(new Date(), new Date(), false)
    )
  }
}
