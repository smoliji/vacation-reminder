import { Subscriber } from './Subscriber'

export class SlackSubscriber extends Subscriber {
  protected channel: string
  constructor(channel: string) {
    super()
    this.channel = channel
  }
  
  public getChannel() {
    return this.channel
  }
}
