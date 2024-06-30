import { deepEqual } from 'node:assert'
import test, { describe } from 'node:test'
import { Email } from './Email'
import { Day, Vacation } from './Reminder'
import { SlackReminder } from './SlackReminder'
import { SlackSubscriber } from './SlackSubscriber'

describe('SlackReminder', () => {
  test('Creates simple message', () => {
    const message = new SlackReminder(
      'test',
      [
        new Vacation(
          new Day(new Date('2024-01-01')),
          new Email('a@example.com')
        ),
      ],
      new SlackSubscriber('john'),
      {
        d0: new Day(new Date('2024-01-01')),
        size: 7,
        holidays: [],
        users: [new Email('a@example.com')],
      }
    ).getMessage()
    deepEqual(message, {
      text: `📅 Upcoming *test* vacations for the next 7 days
Week 1 (1.1.2024)
 • 🌴 a@example.com — 1 days

`,
    })
  })
  test('Message contains sections of "weeks", stating information about vacations and group info about those who has no vacations', () => {
    const message = new SlackReminder(
      'test',
      [
        new Vacation(
          new Day(new Date('2024-01-01')),
          new Email('a@example.com')
        ),
        new Vacation(
          new Day(new Date('2024-01-02')),
          new Email('a@example.com')
        ),
        new Vacation(
          new Day(new Date('2024-01-01')),
          new Email('b@example.com')
        ),
        new Vacation(
          new Day(new Date('2024-01-09')),
          new Email('b@example.com')
        ),
      ],
      new SlackSubscriber('john'),
      {
        d0: new Day(new Date('2024-01-01')),
        size: 14,
        holidays: [
          new Day(new Date('2024-01-01')),
        ],
        users: [
          new Email('a@example.com'),
          new Email('b@example.com'),
          new Email('c@example.com'),
        ],
      }
    ).getMessage()
    deepEqual(message, {
      text: `📅 Upcoming *test* vacations for the next 14 days
Week 1 (1.1.2024)
 • 🇨🇿 1 national holidays
 • 🌴 a@example.com — 2 days
 • 🌴 b@example.com — 1 days
 • No vacations for c@example.com

Week 2 (8.1.2024)
 • 🌴 b@example.com — 1 days
 • No vacations for a@example.com, c@example.com

`,
    })
  })
  test('Slack message displays "empty case" in case there are no users', () => {
    const message = new SlackReminder('test', [], new SlackSubscriber('john'), {
      d0: new Day(new Date('2024-01-01')),
      size: 7,
      holidays: [],
      users: [],
    }).getMessage()
    deepEqual(message, {
      text: 'No subjects',
    })
  })
})
