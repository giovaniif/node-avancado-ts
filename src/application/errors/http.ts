export class ServerError extends Error {
  constructor (error?: Error) {
    super('server failed, try again please')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}
