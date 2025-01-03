export class NotAllowedError extends Error implements Error {
  constructor() {
    super(`Not Allowed`)
  }
}
