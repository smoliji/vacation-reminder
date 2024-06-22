import { Email } from './Email'

export class EmailAddressParser {
  protected readonly text: string
  constructor(text: string) {
    this.text = text
  }
  public parse(): Email[] {
    const tokens = this.text.split(',')
    const result: Array<Email> = []
    for (const token of tokens) {
      result.push(this.parseSingleEmailAddress(token))
    }
    return result
  }

  public parseOne(): Email {
    const email = this.parse()
    if (!email.length) throw new EmptyAddress()
    return email[0]
  }

  protected parseSingleEmailAddress(address: string) {
    if (this.includesDisplayName(address)) {
      return this.parseSingleEmailAddressWithName(address)
    } else {
      const email = address.trim()
      return new Email(email, email)
    }
  }

  protected parseSingleEmailAddressWithName(address: string) {
    const emailPart = address.match('<[^>]+>')?.[0]
    const email = emailPart?.replace('<', '').replace('>', '').trim()
    const name = address.replace(emailPart ?? '', '').trim() ?? email
    if (!email) throw new EmptyAddress()
    return new Email(email, name)
  }

  protected includesDisplayName(x: string) {
    return x.includes('<')
  }
}

class EmptyAddress extends Error {}
