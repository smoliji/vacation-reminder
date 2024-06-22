import test, { describe } from 'node:test'
import { Email, InvalidEmail } from './Email'
import { equal, throws } from 'node:assert'

describe('Email', () => {
  test('Creating Email throws InvalidEmail if email is not valid', () => {
    const invalidEmails = ['asd', '653', 'example.com']
    for (const email of invalidEmails) {
      throws(
        () => new Email(email),
        InvalidEmail,
        '"$1" should not be valid email'.replace('$1', email)
      )
    }
  })
  test('Email equals another email if addr-spec is equal', () => {
    equal(
      new Email('test@example.com', 'a').equals(
        new Email('test@example.com', 'b')
      ),
      true
    )
    equal(
      new Email('a@example.com').equals(
        new Email('b@example.com')
      ),
      false
    )
  })
})
