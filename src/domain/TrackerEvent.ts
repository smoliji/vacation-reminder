import { Email } from './Email'
import { Event, Time } from './Event'

export class TrackerEvent extends Event {
  protected trackerEventId: string
  constructor(id: string, description: StructuredDescription) {
    super(
      description.originalId,
      description.originalName,
      description.originalDescription,
      description.originalUser,
      description.originalTime
    )
    this.trackerEventId = id
  }

  public getTrackerEventId() {
    return this.trackerEventId
  }
}

export interface StructuredDescription {
  originalName: string
  originalId: string
  originalUser: Email
  originalTime: Time
  originalDescription: string
}
