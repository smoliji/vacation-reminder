import { deepEqual, equal } from 'node:assert'
import test, { describe } from 'node:test'
import { Email } from './Email'
import { Day, Reminder, ReminderDayType, Vacation } from './Reminder'
import { Subscriber } from './Subscriber'

describe('Reminder', () => {
  test('getVacationsGroups creates groups for given users for given size', () => {
    const rem = new Reminder(
      'test',
      [
        new Vacation(day('2024-01-01'), new Email('a@example.com')),
        new Vacation(day('2024-01-04'), new Email('a@example.com')),
      ],
      new Subscriber(),
      {
        d0: day('2024-01-01'),
        size: 7,
        holidays: [day('2024-1-05')],
        users: [new Email('a@example.com')],
      }
    )
    groupsEqual(rem.getVacationsGroups(), [
      [
        'a@example.com',
        [
          ['2024-01-01', ReminderDayType.Vacation],
          ['2024-01-02', ReminderDayType.Workday],
          ['2024-01-03', ReminderDayType.Workday],
          ['2024-01-04', ReminderDayType.Vacation],
          ['2024-01-05', ReminderDayType.Holiday],
          ['2024-01-06', ReminderDayType.Weekend],
          ['2024-01-07', ReminderDayType.Weekend],
        ],
      ],
    ])
  })
  test('getVacationsGroups day type preference is Weekend > Holiday > Vacation > Workday', () => {
    const SATURDAY = day('2024-01-06')
    const FRIDAY = day('2024-01-05')
    equal(getType(SATURDAY, [SATURDAY], []), ReminderDayType.Weekend)
    equal(getType(SATURDAY, [SATURDAY], [SATURDAY]), ReminderDayType.Weekend)
    equal(getType(FRIDAY, [FRIDAY], []), ReminderDayType.Vacation)
    equal(getType(FRIDAY, [FRIDAY], [FRIDAY]), ReminderDayType.Holiday)
    equal(getType(FRIDAY, [SATURDAY], []), ReminderDayType.Workday)

    function getType(day: Day, vacations: Day[], holidays: Day[]) {
      return new Reminder(
        'test',
        vacations.map((x) => new Vacation(x, new Email('a@example.com'))),
        new Subscriber(),
        { d0: day, size: 7, holidays, users: [new Email('a@example.com')] }
      ).getVacationsGroups()[0]?.[1][0].type
    }
  })
  test('getVacationGroups creates groups for input emails', () => {
    groupsEqual(
      new Reminder('test', [], new Subscriber(), {
        d0: day('2024-01-01'),
        size: 0,
        holidays: [],
        users: [
          new Email('a@example.com'),
          new Email('b@example.com'),
          new Email('c@example.com'),
        ],
      }).getVacationsGroups(),
      [
        ['a@example.com', []],
        ['b@example.com', []],
        ['c@example.com', []],
      ]
    )
  })
})

function day(date: `${number}-${number}-${number}`) {
  const [y, m, d] = date.split('-')
  return new Day(new Date(Number(y), Number(m) - 1, Number(d)))
}

function groupsEqual(
  groups: ReturnType<Reminder['getVacationsGroups']>,
  exp: Array<[email: string, Array<[date: string, type: ReminderDayType]>]>
) {
  return deepEqual(
    groups.map((x) => [
      x[0].getEmail(),
      x[1].map((x) => [x.day.toString(), x.type]),
    ]),
    exp
  )
}
