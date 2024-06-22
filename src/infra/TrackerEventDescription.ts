import { Email } from '../domain/Email'
import { Time } from '../domain/Event'
import { StructuredDescription } from '../domain/TrackerEvent'

export class TrackerEventDescription {
  public static unmarshal(data: string): StructuredDescription {
    const parsed = JSON.parse(data)
    const result: StructuredDescription = {
      originalDescription: parsed.original_description,
      originalId: parsed.original_id,
      originalName: parsed.original_name,
      originalTime: new Time(
        new Date(parsed.original_time_start),
        new Date(parsed.original_time_end),
        parsed.original_is_all_day
      ),
      originalUser: new Email(parsed.original_user_email),
    }
    return result
  }

  public static marshal(data: StructuredDescription) {
    return JSON.stringify({
      original_description: data.originalDescription,
      original_id: data.originalId,
      original_name: data.originalName,
      original_time_start: data.originalTime.getStart(),
      original_time_end: data.originalTime.getEnd(),
      original_is_all_day: data.originalTime.isAllDay(),
      original_user_email: data.originalUser.getEmail(),
    })
  }
}
