export class UserHasNotPerfomedCheckInError extends Error {
  constructor() {
    super('user has not performed any check-in.')
  }
}
