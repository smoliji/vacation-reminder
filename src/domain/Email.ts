export class Email {
  protected readonly email: string
  protected readonly displayName: string
  constructor(email: string)
  constructor(email: string, displayName: string)
  constructor(email: string, displayName?: string) {
    this.email = email
    this.displayName = displayName || email
    this.assertEmailValid()
  }
  protected assertEmailValid() {
    if (!this.email?.includes('@')) {
      throw new InvalidEmail()
    }
  }

  public getEmail(): string {
    return this.email
  }

  public getDisplayName(): string {
    return this.displayName
  }

  public equals(b: Email) {
    return this.email === b.email
  }
}

export class InvalidEmail extends Error {}
