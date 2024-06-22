import { deepEqual, equal } from 'node:assert'
import test, { describe } from 'node:test'
import { Calendar } from './Calendar'
import { Email } from './Email'
import { Event, Time } from './Event'
import { ReminderDispatcher } from './ReminderDispatcher'
import { Tracker } from './Tracker'
import { TrackerCalendar } from './TrackerCalendar'
import { HolidayCalendar } from './HolidayCalendar'

describe('ReminderDispatcher', () => {
  test('generateVecations creates 2 vacation days for 1-3 date', () => {
    const result = generateVecations([
      new TestEvent(
        new Time(new Date('2024-01-01'), new Date('2024-01-03'), true),
        'test@example.com'
      ),
    ])
    equal(result.length, 2)
    equal(result[0].getDay().toString(), '2024-01-01')
    equal(result[1].getDay().toString(), '2024-01-02')
    equal(result[1].getEmail().getEmail(), 'test@example.com')
  })
  test('generateVecations creates vacation for not-whole day events as if they were whole day', () => {
    const result = generateVecations([
      new TestEvent(
        new Time(
          new Date('2024-01-01T12:00:00Z'),
          new Date('2024-01-01T13:00:00Z'),
          false
        ),
        'test@example.com'
      ),
    ])
    equal(result.length, 1)
    equal(result[0].getDay().toString(), '2024-01-01')
    equal(result[0].getEmail().getEmail(), 'test@example.com')
  })
  test('generateVecations sorts the output by name and then by date', () => {
    const result = generateVecations([
      new TestEvent(
        new Time(new Date('2024-01-01'), new Date('2024-01-02'), true),
        'b@example.com'
      ),
      new TestEvent(
        new Time(new Date('2024-02-01'), new Date('2024-02-02'), true),
        'a@example.com'
      ),
      new TestEvent(
        new Time(new Date('2024-01-01'), new Date('2024-01-02'), true),
        'c@example.com'
      ),
      new TestEvent(
        new Time(new Date('2024-01-01'), new Date('2024-01-02'), true),
        'a@example.com'
      ),
    ])
    deepEqual(
      result.map((x) => [x.getEmail().getEmail(), x.getDay().toString()]),
      [
        ['a@example.com', '2024-01-01'],
        ['a@example.com', '2024-02-01'],
        ['b@example.com', '2024-01-01'],
        ['c@example.com', '2024-01-01'],
      ]
    )
  })
  test('generateVacations counts multiple events for one day as a single vacation', () => {
    const result = generateVecations([
      new TestEvent(
        new Time(new Date('2024-01-01'), new Date('2024-01-02'), true),
        'a@example.com'
      ),
      new TestEvent(
        new Time(new Date('2024-01-01'), new Date('2024-01-03'), true),
        'a@example.com'
      ),
    ])
    deepEqual(
      result.map((x) => [x.getEmail().getEmail(), x.getDay().toString()]),
      [
        ['a@example.com', '2024-01-01'],
        ['a@example.com', '2024-01-02'],
      ]
    )
  })
  test('getTrackerEventsAfterUpdate finds final state of the events, i.e. the current, except the extra events and with the events that are missing', () => {
    const tracker = new TrackerCalendar('test')
    tracker.setEvents([
      new TestEvent(
        new Time(new Date('2024-01-01'), new Date('2024-01-02'), true),
        'a@example.com',
        '1'
      ),
      new TestEvent(
        new Time(new Date('2024-01-10'), new Date('2024-01-11'), true),
        'a@example.com',
        '2'
      ),
    ])
    const source = new Calendar('test')
    source.setEvents([
      new TestEvent(
        new Time(new Date('2000-01-01'), new Date('2000-01-02'), true),
        'a@example.com',
        '1'
      ),
      new TestEvent(
        new Time(new Date('2024-01-01'), new Date('2024-01-02'), true),
        'a@example.com',
        '3'
      ),
    ])
    tracker.updateMissingEvents(source, [new Email('a@example.com')])
    const final = getTrackerEventsAfterUpdateTest(tracker)
    deepEqual(
      final.map((x) => x.getId()),
      ['1', '3']
    )
    equal(final[0].getTime().getStart().getFullYear(), '2024')
  })
})

class TestEvent extends Event {
  constructor(time: Time, email: string, id?: string) {
    super(id ?? '', '', '', new Email(email), time)
  }
}

function generateVecations(events: Array<TestEvent>) {
  return new TestReminderDispatcher(new HolidayCalendar('test'), {
    sendSlackReminder: () => {},
  }).generateVecations(events)
}

function getTrackerEventsAfterUpdateTest(calendar: TrackerCalendar) {
  return new TestReminderDispatcher(new HolidayCalendar('test'), {
    sendSlackReminder: () => {},
  }).getTrackerEventsAfterUpdateTest(calendar)
}

class TestReminderDispatcher extends ReminderDispatcher {
  public generateVecations(events: Event[]) {
    return super.generateVecations(events)
  }
  public getTrackerEventsAfterUpdateTest(calendar: TrackerCalendar) {
    return super.getTrackerEventsAfterUpdate(new Tracker('', [], calendar, []))
  }
}
