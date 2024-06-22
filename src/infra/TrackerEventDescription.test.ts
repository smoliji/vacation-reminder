import test, { describe } from 'node:test'
import { Time } from '../domain/Event'
import { deepEqual } from 'node:assert'
import { TrackerEventDescription } from '../infra/TrackerEventDescription'
import { Email } from '../domain/Email'

describe('TrackerEventDescription', () => {
  test('Serialization of deserialized object creates the same object', () => {
    deepEqual(TrackerEventDescription.unmarshal(
      TrackerEventDescription.marshal({
        originalDescription: 'description',
        originalId: 'id',
        originalName: 'name',
        originalTime: new Time(new Date(0), new Date(1), true),
        originalUser: new Email('john@example.com'),
      })
    ), {
      originalDescription: 'description',
      originalId: 'id',
      originalName: 'name',
      originalTime: new Time(new Date(0), new Date(1), true),
      originalUser: new Email('john@example.com'),
    })
  })
})
