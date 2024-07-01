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
        size: 14,
        holidays: [],
        users: [new Email('a@example.com')],
      }
    ).getMessage()
    deepEqual(message, {
      text: `*test*, 14-day vacations overview, starting 1.1.2024:
🌴🗓️🗓️🗓️🗓️      🗓️🗓️🗓️🗓️🗓️ — a@example.com
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
      text: `*test*, 7-day vacations overview, starting 1.1.2024:
_Tracker has no subjects_
`,
    })
  })
})
