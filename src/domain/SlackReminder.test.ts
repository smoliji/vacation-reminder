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
      }
    ).getMessage()
    deepEqual(message, {
      text: `See the 7-day vacation overview for \`test\`
▼ Today
🌴🗓🗓🗓🗓🌞🌞 —a@example.com
`,
    })
  })
})
