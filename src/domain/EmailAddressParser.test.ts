import test, { describe } from 'node:test'
import { equal } from 'node:assert'
import { EmailAddressParser } from './EmailAddressParser'

describe('EmailAddressParser', () => {
  test('parse parses multiple emails with display names', () => {
    const result = new EmailAddressParser(
      'John Doe <john.doe@domain.com>, Alice Wonderland <alice@wonderland.com>'
    ).parse()
    equal(result[0].getDisplayName(), 'John Doe')
    equal(result[0].getEmail(), 'john.doe@domain.com')
    equal(result[1].getDisplayName(), 'Alice Wonderland')
    equal(result[1].getEmail(), 'alice@wonderland.com')
  })
})
