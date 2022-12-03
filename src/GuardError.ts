export class GuardError extends Error {
  constructor(public parameterName: string, message: string) {
    super(message);
  }
}
