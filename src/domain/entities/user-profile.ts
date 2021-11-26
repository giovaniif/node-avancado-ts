export class UserProfile {
  initials?: string
  pictureUrl?: string

  constructor (readonly id: string) {}

  setPicture ({ name, pictureUrl }: { pictureUrl?: string, name?: string }): void {
    this.pictureUrl = pictureUrl
    if (pictureUrl === undefined && name !== undefined) {
      const firstLetters = name.match(/\b(.)/g) ?? []
      if (firstLetters.length > 1) {
        this.initials = `${firstLetters.shift() ?? ''}${firstLetters.pop() ?? ''}`.toUpperCase()
      } else {
        this.initials = name.substring(0, 2).toUpperCase()
      }
    }
  }
}
