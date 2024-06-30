import test, { describe } from 'node:test'
import { Day, Reminder, Vacation } from './Reminder'
import { Subscriber } from './Subscriber'
import { deepEqual, equal } from 'node:assert'
import { Email } from './Email'

describe('Reminder', () => {
  test('getWeekGroups groups vacations by weeks to vacationeers and workers, includes holidays', () => {
    const groups = new Reminder(
      'test',
      [
        new Vacation(
          new Day(new Date('2024-01-01')),
          new Email('a@example.com')
        ),
        new Vacation(
          new Day(new Date('2024-01-08')),
          new Email('a@example.com')
        ),
      ],
      new Subscriber(),
      {
        d0: new Day(new Date('2024-01-01')),
        holidays: [new Day(new Date('2024-01-02'))],
        size: 14,
        users: [new Email('a@example.com'), new Email('b@example.com')],
      }
    ).getWeekGroups()
    deepEqual(groups, [
      {
        id: '2024-1',
        number: 1,
        start: new Date('2024-01-01'),
        vacationeers: [
          {
            name: new Email('a@example.com'),
            days: [new Day(new Date('2024-01-01'))],
          },
        ],
        workers: [new Email('b@example.com')],
        holidays: [new Day(new Date('2024-01-02'))],
      },
      {
        id: '2024-2',
        number: 2,
        start: new Date('2024-01-08'),
        vacationeers: [
          {
            name: new Email('a@example.com'),
            days: [new Day(new Date('2024-01-08'))],
          },
        ],
        workers: [new Email('b@example.com')],
        holidays: [],
      },
    ])
  })
})
